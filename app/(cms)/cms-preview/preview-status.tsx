"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CMS_REPO,
  validReviewBranch,
  type ReviewState,
} from "@/lib/cms-review";
export default function PreviewStatus({
  branch,
  pathname,
}: {
  branch: string;
  pathname: string;
}) {
  const [state, setState] = useState<ReviewState>({
    state: "waiting",
    message: "Sprawdzanie zapisanych zmian…",
  });
  const [refresh, setRefresh] = useState(0);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    setChecking(true);
    const check = async () => {
      try {
        const params = new URLSearchParams({ branch, path: pathname });
        const response = await fetch(`/api/cms-preview?${params}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const result: ReviewState = await response.json();
        if (controller.signal.aborted) return;
        setState(result);
        setChecking(false);
        attempts++;
        if (
          response.ok &&
          ["waiting", "building"].includes(result.state) &&
          attempts < 4
        )
          timer = setTimeout(check, 30000);
      } catch {
        if (!controller.signal.aborted) {
          setState({
            state: "error",
            message:
              "Nie udało się połączyć. Odśwież stan lub otwórz listę PR.",
          });
          setChecking(false);
        }
      }
    };
    void check();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [branch, pathname, refresh]);
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "8vh auto",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.6,
        color: "#222",
        background: "#fff",
      }}
    >
      <Link href="/keystatic">← Wróć do CMS</Link>
      <h1>Podgląd zapisanych zmian</h1>
      <p>
        Gałąź: <strong>{branch || "nie wybrano"}</strong>
      </p>
      <p role="status" aria-live="polite">
        {state.message}
      </p>
      {state.head && (
        <p>
          Commit: <code>{state.head.slice(0, 7)}</code>
        </p>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 20,
        }}
      >
        {state.previewUrl && (
          <a href={state.previewUrl} target="_blank" rel="noopener noreferrer">
            Otwórz podgląd strony ↗
          </a>
        )}
        {state.prUrl && (
          <a href={state.prUrl} target="_blank" rel="noopener noreferrer">
            Otwórz PR i zatwierdzenie ↗
          </a>
        )}
        <button
          type="button"
          disabled={checking}
          onClick={() => setRefresh((value) => value + 1)}
          style={{ padding: "10px 16px", cursor: "pointer" }}
        >
          Odśwież stan
        </button>
      </div>
      <p>
        <a
          href={`https://github.com/${CMS_REPO}/pulls`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Lista Pull Requests ↗
        </a>
      </p>
      {validReviewBranch(branch) && (
        <p>
          <a
            href={`https://github.com/${CMS_REPO}/compare/main...${encodeURIComponent(branch)}?expand=1`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Utwórz PR ręcznie, jeśli automatyzacja go nie utworzyła ↗
          </a>
        </p>
      )}
      <p>
        Podgląd obejmuje zapisane zmiany po zakończeniu buildu. Każdy kolejny
        zapis może wymagać nowego buildu. Szkice pozostają ukryte. Strona
        sprawdza stan najwyżej cztery razy, potem użyj „Odśwież stan”.
      </p>
    </main>
  );
}
