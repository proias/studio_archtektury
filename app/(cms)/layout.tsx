import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CMS — Cywińska Studio",
  robots: { index: false, follow: false },
};
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
