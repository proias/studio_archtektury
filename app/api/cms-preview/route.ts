import {
  readReviewState,
  validPreviewPath,
  validReviewBranch,
} from "@/lib/cms-review";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const branch = params.get("branch") || "";
  const pathname = params.get("path") || "/";
  const headers = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  };
  if (!validReviewBranch(branch) || !validPreviewPath(pathname))
    return Response.json(
      {
        state: "error",
        message:
          "Wybierz gałąź roboczą cms/… w panelu CMS. Podgląd dotyczy zapisanych zmian.",
      },
      { status: 400, headers },
    );
  try {
    return Response.json(await readReviewState(branch, pathname), { headers });
  } catch (error) {
    return Response.json(
      {
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nie udało się sprawdzić podglądu.",
      },
      { status: 502, headers },
    );
  }
}
