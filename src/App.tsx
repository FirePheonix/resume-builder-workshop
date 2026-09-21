import { Toaster } from "sonner";
import Component10HeroSection from "./imports/10HeroSection";

export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Component10HeroSection />
      <Toaster position="bottom-center" />
    </div>
  );
}
