import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

export function chromeExecutable() {
  return (
    process.env.CHROME_PATH ||
    (process.platform === "win32"
      ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
      : "/usr/bin/google-chrome")
  );
}

export function checkBrowserMemory() {
  const freeMiB = Math.round(os.freemem() / 1024 ** 2);
  const minimumMiB = Number(process.env.QA_MIN_FREE_MIB || 1024);
  if (!Number.isFinite(minimumMiB) || minimumMiB < 512) {
    throw new Error("QA_MIN_FREE_MIB must be at least 512");
  }
  if (freeMiB < minimumMiB) {
    throw new Error(
      `Test Chrome nie został uruchomiony: wolne ${freeMiB} MiB RAM; wymagane co najmniej ${minimumMiB} MiB. Uruchamiaj build, dev i testy pojedynczo.`,
    );
  }
}

function stopChrome(chrome) {
  if (!chrome.pid || chrome.exitCode !== null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(chrome.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
  } else chrome.kill();
}

export function monitorBrowserMemory(chrome) {
  const timer = setInterval(() => {
    const freeMiB = Math.round(os.freemem() / 1024 ** 2);
    if (freeMiB < 128) {
      clearInterval(timer);
      console.error(`Chrome QA stopped: only ${freeMiB} MiB RAM available.`);
      stopChrome(chrome);
    }
  }, 1000);
  timer.unref();
  return () => clearInterval(timer);
}

export async function closeTestChrome(chrome, profile) {
  // Only the test's own PID and its renderers are terminated.
  stopChrome(chrome);
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const resolved = path.resolve(profile);
  const relative = path.relative(temporaryRoot, resolved);
  if (
    relative.startsWith("..") ||
    path.isAbsolute(relative) ||
    !/^(cms-qa-|archi-browser-)/.test(path.basename(resolved))
  ) {
    throw new Error("Unexpected Chrome QA profile path");
  }
  await fs
    .rm(resolved, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 200,
    })
    .catch(() => undefined);
}
