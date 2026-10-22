import type { Metadata } from "next";
import PreviewStatus from "./preview-status";
export const metadata: Metadata = {
  title: "Podgląd zmian — CMS",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; path?: string }>;
}) {
  const params = await searchParams;
  return (
    <PreviewStatus
      branch={typeof params.branch === "string" ? params.branch : ""}
      pathname={typeof params.path === "string" ? params.path : "/"}
    />
  );
}
