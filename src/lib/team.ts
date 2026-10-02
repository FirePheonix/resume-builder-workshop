export const API_URL = import.meta.env.VITE_API_URL || "";
export const UNSTOP_URL =
  "https://unstop.com/p/codezilla-30-the-spike-rush-indian-institute-of-information-technology-iiit-sonepat-1764808";

export type TeamMember = { role: string; name: string; agent: string };
export type PublicTeam = {
  slug: string;
  number: number;
  teamName: string;
  registeredAt: string;
  members: TeamMember[];
};

const TEAM_KEY = "cz-team";

/** Last team registered/seen on this device, used to skip /register for returning users. */
export function getSavedTeam(): { slug: string; teamName: string } | null {
  try {
    const v = JSON.parse(localStorage.getItem(TEAM_KEY) || "null");
    return v && typeof v.slug === "string" ? v : null;
  } catch {
    return null;
  }
}
export function saveTeam(team: { slug: string; teamName: string }) {
  localStorage.setItem(TEAM_KEY, JSON.stringify({ slug: team.slug, teamName: team.teamName }));
}
export function clearSavedTeam() {
  localStorage.removeItem(TEAM_KEY);
}

export class TeamNotFoundError extends Error {}

export const PREVIEW_TEAM: PublicTeam = {
  slug: "preview",
  number: 7,
  teamName: "Runtime Terror",
  registeredAt: new Date().toISOString(),
  members: [
    { role: "Team Leader", name: "Shubham Singh", agent: "Jett" },
    { role: "Member 2", name: "Riya Sharma", agent: "Sage" },
    { role: "Member 3", name: "Arjun Mehta", agent: "Phoenix" },
  ],
};

export async function fetchTeam(slug: string, signal?: AbortSignal): Promise<PublicTeam> {
  if (import.meta.env.DEV && slug === PREVIEW_TEAM.slug) return PREVIEW_TEAM;
  const res = await fetch(`${API_URL}/api/team/${encodeURIComponent(slug)}`, { signal });
  if (res.status === 404 || res.status === 400) throw new TeamNotFoundError("Team not found");
  if (!res.ok) throw new Error("Failed to load team");
  const body = (await res.json()) as { team: PublicTeam };
  return body.team;
}
