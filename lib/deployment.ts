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
