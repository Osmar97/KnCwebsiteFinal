/**
 * Single source of truth for the admin allowlist.
 * Used by AdminContext (auth gating), AdminLogin (UI), and the PropertyEditor
 * agent selectors. To add/remove an admin, edit this list only — do NOT scatter
 * email strings across components.
 *
 * NOTE: Server-side admin checks live in the Supabase `is_admin_user()` function.
 * Keep that allowlist in sync when this list changes.
 */
export interface AdminProfile {
  email: string;
  shortName: string;
  name: string;
  title: string;
  /** Publicly hosted avatar URL or `/lovable-uploads/...` asset path. */
  avatar?: string;
}

export const ADMIN_PROFILES: readonly AdminProfile[] = [
  {
    email: "ismael@kingsncompany.com",
    shortName: "Ismael",
    name: "Ismael Gomes Queta",
    title: "Founder & CEO",
    avatar: "/lovable-uploads/ismaPerfil.JPG",
  },
  {
    email: "joey@kingsncompany.com",
    shortName: "Joey",
    name: "Jonathan Ehioghiren",
    title: "Marketing Assistant",
  },
] as const;

export const ADMIN_EMAILS: readonly string[] = ADMIN_PROFILES.map((p) => p.email);

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export const findAdminProfile = (
  email: string | null | undefined,
): AdminProfile | undefined => {
  if (!email) return undefined;
  const normalized = email.toLowerCase().trim();
  return ADMIN_PROFILES.find((p) => p.email === normalized);
};