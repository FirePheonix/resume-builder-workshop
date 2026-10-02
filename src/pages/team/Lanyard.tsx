/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type MaterialNode,
  type Object3DNode,
  type ThreeElements,
  type ThreeEvent,
} from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import cardGLB from "@/assets/lanyard/card.glb?url";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

// R3F v8 only augments the global JSX namespace; @types/react 19 reads React.JSX.
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}

useGLTF.preload(cardGLB);

/** Anchor starts this far above its resting point and eases down, so the card drops in from off-screen. */
const DROP = 9;
const DROP_SECONDS = 1.1;
/** At rest the card hangs ~4.5 units below the anchor, so this centres it slightly below the middle of the view. */
const ANCHOR_Y = 4.3;
const CAMERA_Z = 30;
/** Visible card mesh size in world units (card.glb at scale 2.25). */
const CARD_H = 2.3;
const CARD_W = 1.61;

/** Fit the card to ~56% of the stage height, or ~62% of its width on narrow screens. */
function Framing() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const { width, height } = useThree((s) => s.size);
  useEffect(() => {
    const aspect = width / Math.max(1, height);
    const halfH = Math.max(CARD_H / (2 * 0.56), CARD_W / (2 * 0.62 * aspect));
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfH / CAMERA_Z));
    camera.updateProjectionMatrix();
  }, [camera, width, height]);
  return null;
}

type LanyardProps = {
  atlas: HTMLCanvasElement;
  strap: HTMLCanvasElement;
  flipped: boolean;
  onTap?: () => void;
};

export default function Lanyard({ atlas, strap, flipped, onTap }: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_Z], fov: 9 }}
      dpr={[1, 2]}
      flat
      gl={{ alpha: true }}
      onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
    >
      <Framing />
      <ambientLight intensity={2.6} />
      <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
        <Band isMobile={isMobile} atlas={atlas} strap={strap} flipped={flipped} onTap={onTap} />
      </Physics>
      <Environment blur={0.75} environmentIntensity={0.45}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="#ff4655" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

type LerpedBody = RapierRigidBody & { lerped?: THREE.Vector3 };

type BandProps = {
  isMobile: boolean;
  atlas: HTMLCanvasElement;
  strap: HTMLCanvasElement;
  flipped: boolean;
  onTap?: () => void;
};

function Band({ isMobile, atlas, strap, flipped, onTap }: BandProps) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LerpedBody>(null!);
  const j2 = useRef<LerpedBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const face = useRef<THREE.Group>(null!);
  const dropT = useRef(0);
  const tap = useRef<{ x: number; y: number; t: number } | null>(null);

  const [vec] = useState(() => new THREE.Vector3());
  const [ang] = useState(() => new THREE.Vector3());
  const [rot] = useState(() => new THREE.Vector3());
  const [dir] = useState(() => new THREE.Vector3());

  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(cardGLB) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshStandardMaterial>;
  };

  const cardMap = useMemo(() => {
    const t = new THREE.CanvasTexture(atlas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = false;
    t.anisotropy = 16;
    return t;
  }, [atlas]);
  const strapMap = useMemo(() => {
    const t = new THREE.CanvasTexture(strap);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  }, [strap]);
  useEffect(() => () => cardMap.dispose(), [cardMap]);
  useEffect(() => () => strapMap.dispose(), [strapMap]);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  const getLerped = (body: LerpedBody) => {
    if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation());
    return body.lerped;
  };

  useFrame((state, delta) => {
    if (!fixed.current || !card.current) return;

    if (dropT.current < 1) {
      dropT.current = Math.min(1, dropT.current + delta / DROP_SECONDS);
      const e = 1 - Math.pow(1 - dropT.current, 3);
      fixed.current.setNextKinematicTranslation({ x: 0, y: ANCHOR_Y + DROP * (1 - e), z: 0 });
      [card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp());
    }

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }

    [j1, j2].forEach((ref) => {
      const lerped = getLerped(ref.current);
      const dist = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
      lerped.lerp(ref.current.translation(), delta * (dist * 50));
    });
    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(getLerped(j2.current));
    curve.points[2].copy(getLerped(j1.current));
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
    ang.copy(card.current.angvel() as THREE.Vector3);
    rot.copy(card.current.rotation() as unknown as THREE.Vector3);
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);

    const target = flipped ? Math.PI : 0;
    face.current.rotation.y = THREE.MathUtils.damp(face.current.rotation.y, target, 7, delta);
  });

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    tap.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation() as THREE.Vector3)));
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    drag(false);
    const start = tap.current;
    tap.current = null;
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 6 && performance.now() - start.t < 350) onTap?.();
  };

  return (
    <>
      <group position={[0, ANCHOR_Y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="kinematicPosition" position={[0, DROP, 0]} />
        <RigidBody position={[0.3, DROP - 0.9, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.6, DROP - 1.8, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.9, DROP - 2.7, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0.9, DROP - 2.7 - 1.45, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group ref={face}>
            <group
              scale={2.25}
              position={[0, -1.2, -0.05]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={onUp}
              onPointerDown={onDown}
            >
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardMap}
                  map-anisotropy={16}
                  clearcoat={isMobile ? 0 : 1}
                  clearcoatRoughness={0.12}
                  roughness={0.65}
                  metalness={0}
                />
              </mesh>
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? new THREE.Vector2(1000, 2000) : new THREE.Vector2(1000, 1000)}
          useMap={1}
          map={strapMap}
          repeat={new THREE.Vector2(-4, 1)}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
