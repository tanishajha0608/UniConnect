const ALLOWED_DOMAIN = (process.env.ALLOWED_EMAIL_DOMAIN ?? "ucr.edu").toLowerCase();

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Only addresses at the campus domain itself (not subdomains or look-alikes). */
export function isAllowedEmail(raw: string, domain = ALLOWED_DOMAIN): boolean {
  const email = normalizeEmail(raw);
  const match = /^[a-z0-9._%+-]+@([a-z0-9.-]+)$/.exec(email);
  return !!match && match[1] === domain;
}

/** "Tanisha Jha" -> "Tanisha J." for people you haven't matched with yet. */
export function publicName(name: string | undefined | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "UCR student";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}
