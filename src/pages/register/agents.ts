import data from "../../data/agents.json";

export type Agent = {
  name: string;
  slug: string;
  role: string;
  roleIcon: string;
  description: string;
  icon: string;
  portrait: string;
  background: string;
  colors: [string, string];
  abilities: { slot: string; name: string; icon: string }[];
  voices: { src: string; text: string; kind: string }[];
};

export const AGENTS = data as Agent[];
export const AGENT_BY_NAME = new Map(AGENTS.map((a) => [a.name, a]));
export const ROLES = ["Duelist", "Initiator", "Controller", "Sentinel"] as const;
export const ROLE_ICON = new Map(AGENTS.map((a) => [a.role, a.roleIcon]));

// Must stay in sync with VALORANT_CHARACTERS in algozenith-backend/src/schemas/register.ts
export const VALORANT_CHARACTERS = [
  "Brimstone", "Phoenix", "Sage", "Sova", "Viper", "Cypher", "Reyna",
  "Killjoy", "Breach", "Omen", "Jett", "Raze", "Skye", "Yoru", "Astra",
  "KAY/O", "Chamber", "Neon", "Fade", "Harbor", "Gekko", "Deadlock",
  "Iso", "Clove", "Vyse", "Tejo", "Waylay",
] as const;
