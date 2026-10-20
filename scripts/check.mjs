import { spawnSync } from "node:child_process";
const result = spawnSync(
  process.execPath,
  ["node_modules/typescript/bin/tsc", "--noEmit"],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
