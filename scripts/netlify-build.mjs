import { spawnSync } from "node:child_process";
if (process.env.CONTEXT === "production") {
  console.error(
    "Publikacja produkcyjna jest zablokowana w tej wersji roboczej. Najpierw zatwierdź materiały i otwarte punkty odbioru oraz przygotuj osobną zmianę konfiguracji publikacji.",
  );
  process.exit(1);
}
const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  { stdio: "inherit", env: process.env },
);
process.exit(result.status ?? 1);
