export const CMS_REPO = "proias/studio_archtektury";
export const CMS_REVIEWER = "proias";
export const CMS_PREVIEW_HOST = "cywinska-studio.netlify.app";

export function validReviewBranch(branch: string) {
  return (
    /^cms\/[a-zA-Z0-9][a-zA-Z0-9_/-]{0,120}$/.test(branch) &&
    !branch.endsWith("/") &&
    !branch.includes("//")
  );
}

export function validPreviewPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/projekty" ||
    pathname === "/prywatnosc" ||
    /^\/projekty\/[a-z0-9-]+$/.test(pathname)
  );
}

export type ReviewState = {
  state: "waiting" | "building" | "ready" | "error" | "merged" | "closed";
  message: string;
  head?: string;
  prUrl?: string;
  previewUrl?: string;
};

type PullRequest = {
  number: number;
  html_url: string;
  state: string;
  merged_at: string | null;
  head: { sha: string };
};
type CommitStatus = {
  sha: string;
  statuses: { context: string; state: string; target_url: string | null }[];
};

// Only the fixed public repository is queried. No editor credentials are read or forwarded.
export async function readReviewState(
  branch: string,
  pathname: string,
  fetcher: typeof fetch = fetch,
): Promise<ReviewState> {
  if (!validReviewBranch(branch) || !validPreviewPath(pathname))
    throw new Error("Nieprawidłowa gałąź lub ścieżka podglądu.");
  async function get<T>(endpoint: string): Promise<T> {
    const response = await fetcher(
      `https://api.github.com/repos/${CMS_REPO}/${endpoint}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok)
      throw new Error(
        response.status === 403 || response.status === 429
          ? "GitHub ograniczył liczbę odczytów. Otwórz PR lub spróbuj ponownie później."
          : "Nie udało się odczytać stanu GitHub. Spróbuj ponownie.",
      );
    return response.json();
  }
  const prs = await get<PullRequest[]>(
    `pulls?state=all&head=${encodeURIComponent("proias:" + branch)}&base=main&per_page=1&sort=created&direction=desc`,
  );
  const pr = prs[0];
  if (!pr)
    return {
      state: "waiting",
      message:
        "Po pierwszym zapisie automatyzacja utworzy PR. Może to potrwać kilkadziesiąt sekund.",
    };
  const common = {
    head: pr.head.sha,
    prUrl: `https://github.com/${CMS_REPO}/pull/${pr.number}`,
  };
  if (pr.state === "closed")
    return {
      ...common,
      state: pr.merged_at ? "merged" : "closed",
      message: pr.merged_at
        ? "Zmiany scalono. Nową sesję rozpocznij na nowej gałęzi z aktualnego main."
        : "PR zamknięto bez publikacji. Utwórz nową gałąź do następnych zmian.",
    };
  // Read the branch ref, not only PR metadata: GitHub may update the PR a moment after Save.
  const result = await get<CommitStatus>(
    `commits/${encodeURIComponent(branch)}/status`,
  );
  const status =
    result.sha === pr.head.sha
      ? result.statuses.find(
          (item) => item.context === "netlify/cywinska-studio/deploy-preview",
        )
      : undefined;
  if (!status || status.state === "pending")
    return {
      ...common,
      head: result.sha,
      state: "building",
      message:
        "Netlify przygotowuje podgląd aktualnego commitu. Strona produkcyjna pozostaje bez zmian.",
    };
  if (status.state !== "success")
    return {
      ...common,
      state: "error",
      message:
        "Build podglądu nie zakończył się poprawnie. Sprawdź kontrolki w PR.",
    };
  const url = status.target_url;
  if (
    !url ||
    !/^https:\/\/deploy-preview-\d+--cywinska-studio\.netlify\.app\/?$/.test(
      url,
    )
  )
    return {
      ...common,
      state: "error",
      message: "Brak potwierdzonego adresu Deploy Preview. Sprawdź PR.",
    };
  return {
    ...common,
    state: "ready",
    message:
      "Podgląd gotowy dla wskazanego commitu. Merge do main wymaga zatwierdzenia właściciela.",
    previewUrl: new URL(pathname, url).href,
  };
}
