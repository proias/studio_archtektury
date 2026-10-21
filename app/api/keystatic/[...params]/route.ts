import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
let handlers: ReturnType<typeof makeRouteHandler> | undefined;
const getHandlers = () => (handlers ??= makeRouteHandler({ config }));
function available() {
  if (process.env.NODE_ENV === "development") return true;
  if (config.storage.kind === "local") return false;
  return Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET &&
      process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
  );
}
export async function GET(request: Request) {
  if (!available())
    return new Response(
      "CMS wymaga konfiguracji GitHub w środowisku produkcyjnym.",
      { status: 503 },
    );
  return getHandlers().GET(request);
}
export async function POST(request: Request) {
  if (!available())
    return new Response(
      "CMS wymaga konfiguracji GitHub w środowisku produkcyjnym.",
      { status: 503 },
    );
  return getHandlers().POST(request);
}
