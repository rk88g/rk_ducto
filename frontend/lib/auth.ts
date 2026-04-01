export const sessionCookieName = "rk_ducto_session";
export const userCookieName = "rk_ducto_user";
export const sessionDurationSeconds = 60 * 60 * 8;

export const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(
  /\/$/,
  ""
);
export const googleMapsEmbedUrl =
  (process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? "").trim();

export function buildCookie(
  name: string,
  value: string,
  maxAge = sessionDurationSeconds
) {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
}
