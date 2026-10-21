export const PRODUCTION_ORIGIN = "https://cywinska-studio.pl";
export function canonicalUrl(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//"))
    throw new Error("Canonical wymaga lokalnej ścieżki strony.");
  return new URL(pathname, PRODUCTION_ORIGIN).href;
}
export function getPreviewOrigin(
  env: Record<string, string | undefined> = process.env,
): string {
  const candidate =
    env.DEPLOY_PRIME_URL ||
    env.DEPLOY_URL ||
    env.URL ||
    "http://localhost:3000";
  const url = new URL(candidate);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("Nieprawidłowy adres podglądu");
  return url.origin;
}
