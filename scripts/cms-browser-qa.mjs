import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import {
  checkBrowserMemory,
  chromeExecutable,
  closeTestChrome,
  monitorBrowserMemory,
} from "./chrome-qa-process.mjs";

const base = process.env.QA_URL || "http://127.0.0.1:3001";
assert.ok(
  ["127.0.0.1", "localhost"].includes(new URL(base).hostname),
  "CMS save test is local only",
);
const out = path.resolve("docs/qa-cms");
checkBrowserMemory();
// Warm webpack routes before starting Chrome instead of compiling alongside it.
for (const route of ["/", "/keystatic"]) {
  const response = await fetch(base + route, {
    signal: AbortSignal.timeout(180000),
  });
  assert.equal(response.status, 200, `Warm-up ${route}`);
  await response.text();
}
checkBrowserMemory();
try {
  await fetch("http://127.0.0.1:9224/json/version", {
    signal: AbortSignal.timeout(1000),
  });
  throw new Error(
    "Chrome QA port 9224 is occupied; do not attach to another test session.",
  );
} catch (error) {
  if (error.message.includes("occupied")) throw error;
}
await fs.mkdir(out, { recursive: true });
const original = await fs.readFile("content/site.json", "utf8");
const originalAppearance = await fs.readFile("content/appearance.json", "utf8");
const appearanceFixture = "public/images/site/cms-appearance-browser-test.png";
const site = JSON.parse(original);
const checks = [],
  errors = [],
  imageResponses = [],
  pending = new Map();
let socket,
  id = 0,
  edited = false,
  appearanceEdited = false,
  fixtureCreated = false,
  savedToDisk = false;
const profile = await fs.mkdtemp(path.join(os.tmpdir(), "cms-qa-"));
const chrome = spawn(
  chromeExecutable(),
  [
    "--headless=new",
    ...(process.env.CI ? ["--no-sandbox"] : []),
    "--disable-gpu",
    "--disable-background-networking",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9224",
    "--user-data-dir=" + profile,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const stopMemoryMonitor = monitorBrowserMemory(chrome);
async function until(fn, timeout = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      if (await fn()) return;
    } catch {}
    await pause(200);
  }
  throw new Error("CMS browser timeout");
}
function send(method, params = {}, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const key = ++id;
    pending.set(key, { resolve, reject });
    socket.send(JSON.stringify({ id: key, method, params }));
    setTimeout(() => {
      if (pending.delete(key)) reject(new Error(method + " timeout"));
    }, timeout).unref();
  });
}
async function evaluate(expression, timeout = 15000) {
  const result = await send(
    "Runtime.evaluate",
    {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true,
    },
    timeout,
  );
  if (result.exceptionDetails)
    throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function goto(route, contains) {
  const navigation = await send("Page.navigate", { url: base + route });
  if (navigation.errorText)
    throw new Error(`Navigation ${route}: ${navigation.errorText}`);
  await until(() =>
    evaluate(
      `location.pathname === ${JSON.stringify(route)} && document.body.innerText.includes(${JSON.stringify(contains)})`,
    ),
  );
  await until(() => evaluate('document.readyState === "complete"'));
  await evaluate("document.fonts.ready.then(() => true)");
}
function check(name, value) {
  assert.ok(value, name);
  checks.push(name);
  console.log("OK", name);
}
try {
  await until(
    async () => (await fetch("http://127.0.0.1:9224/json/version")).ok,
  );
  const target = await fetch("http://127.0.0.1:9224/json/new?about:blank", {
    method: "PUT",
  }).then((r) => r.json());
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      message.error
        ? request.reject(new Error(JSON.stringify(message.error)))
        : request.resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown")
      errors.push(message.params.exceptionDetails);
    else if (
      message.method === "Network.responseReceived" &&
      message.params.response.url.includes("/api/keystatic/blob/") &&
      message.params.response.url.includes("/public/images/projects/")
    ) {
      imageResponses.push({
        url: message.params.response.url,
        status: message.params.response.status,
      });
    } else if (
      message.method === "Page.javascriptDialogOpening" &&
      message.params.type === "beforeunload" &&
      savedToDisk
    ) {
      void send("Page.handleJavaScriptDialog", { accept: true }).catch(
        (error) => errors.push(error.message),
      );
    }
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto("/", "Architektura");
  check(
    "public layout has header and font",
    await evaluate(
      '!!document.querySelector(".site-header") && getComputedStyle(document.body).fontFamily.includes("ptSans")',
    ),
  );
  await goto("/keystatic", "Projekty");
  check(
    "CMS excludes public header and footer",
    await evaluate('!document.querySelector(".site-header, .site-footer")'),
  );
  check(
    "CMS excludes public CSS tokens",
    await evaluate(
      '!getComputedStyle(document.documentElement).getPropertyValue("--dark-background").trim()',
    ),
  );
  await goto("/keystatic/collection/projects", "Dom w Łódzkiem III");
  const titles = JSON.parse(
    await fs.readFile("docs/archive/cms-before-migration.json", "utf8"),
  ).projects.map((p) => p.title);
  check(
    "CMS lists all 12 migrated projects",
    await evaluate(
      `${JSON.stringify(titles)}.every(title => document.body.innerText.includes(title))`,
    ),
  );
  await goto("/keystatic/collection/projects/item/dom-lodzkie-3", "Galeria");
  check(
    "project editor loads title and existing images",
    await evaluate(
      '[...document.querySelectorAll("input")].some(i => i.value === "Dom w Łódzkiem III") && !document.body.innerText.includes("Unable to load")',
    ),
  );
  await until(() => imageResponses.length >= 3);
  check(
    "CMS loads existing image assets",
    imageResponses.every((image) => image.status === 200),
  );
  await goto("/keystatic/singleton/appearance", "Główny napis logo");
  check(
    "CMS exposes logo text and upload editor",
    await evaluate(
      'document.body.innerText.includes("Plik logo") && [...document.querySelectorAll("input")].some(i => i.value === "PAULINA CYWIŃSKA")',
    ),
  );
  check(
    "CMS exposes independent hero image and framing controls",
    await evaluate(
      'document.body.innerText.includes("Zdjęcie główne strony") && document.body.innerText.includes("Kadrowanie zdjęcia głównego") && document.body.innerText.includes("Pozycja kadru")',
    ),
  );
  const { default: sharp } = await import("sharp");
  await fs.writeFile(
    appearanceFixture,
    await sharp({
      create: { width: 64, height: 32, channels: 4, background: "#638072" },
    })
      .png()
      .toBuffer(),
    { flag: "wx" },
  );
  fixtureCreated = true;
  const appearance = JSON.parse(originalAppearance);
  appearance.logo.src = "/images/site/cms-appearance-browser-test.png";
  appearance.logo.alt = "Logo testowe CMS";
  appearance.hero = {
    src: appearance.logo.src,
    alt: "Zdjęcie testowe CMS",
    objectFit: "cover",
    objectPosition: "50% 0%",
  };
  appearanceEdited = true;
  await fs.writeFile("content/appearance.json", JSON.stringify(appearance));
  await goto("/", "Architektura");
  await until(() =>
    evaluate(
      '[...document.querySelectorAll(".wordmark-logo")].length === 2 && [...document.querySelectorAll(".site-header .wordmark-logo, .hero img")].every(i => i.complete && i.naturalWidth > 0) && document.querySelector(".hero img").alt === "Zdjęcie testowe CMS"',
    ),
  );
  check(
    "uploaded logo renders in header and footer",
    await evaluate(
      '[...document.querySelectorAll(".wordmark-logo")].every(i => i.alt === "Logo testowe CMS")',
    ),
  );
  check(
    "independent hero renders with selected framing",
    await evaluate(
      'getComputedStyle(document.querySelector(".hero img")).objectFit === "cover" && getComputedStyle(document.querySelector(".hero img")).objectPosition === "50% 0%"',
    ),
  );
  await evaluate('document.querySelector(".site-footer").scrollIntoView()');
  await until(() =>
    evaluate(
      'document.querySelector(".site-footer .wordmark-logo").complete && document.querySelector(".site-footer .wordmark-logo").naturalWidth > 0',
    ),
  );
  await evaluate("window.scrollTo(0, 0)");
  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });
    check(
      `uploaded logo and hero fit viewport ${width}`,
      await evaluate(
        'document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll(".wordmark-logo")].every(i => i.getBoundingClientRect().width <= 240)',
      ),
    );
    const capture = await send("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(
      path.join(out, `appearance-${width}.png`),
      Buffer.from(capture.data, "base64"),
    );
  }
  await fs.writeFile("content/appearance.json", originalAppearance);
  appearanceEdited = false;
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto("/keystatic/singleton/site", "Tytuł SEO");
  const title = site.title + " — test CMS";
  await evaluate(
    `[...document.querySelectorAll("input")].find(i => i.value === ${JSON.stringify(site.title)}).focus()`,
  );
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "a",
    code: "KeyA",
    windowsVirtualKeyCode: 65,
    modifiers: 2,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "a",
    code: "KeyA",
    windowsVirtualKeyCode: 65,
    modifiers: 2,
  });
  await send("Input.insertText", { text: title });
  await until(() =>
    evaluate(
      '[...document.querySelectorAll("button")].some(b => b.textContent.trim().startsWith("Save") && !b.disabled)',
    ),
  );
  edited = true;
  await evaluate(
    '[...document.querySelectorAll("button")].find(b => b.textContent.trim().startsWith("Save") && !b.disabled).click()',
  );
  await until(
    async () =>
      JSON.parse(await fs.readFile("content/site.json", "utf8")).title ===
      title,
  );
  check("CMS saves singleton to JSON", true);
  savedToDisk = true;
  await until(() =>
    evaluate(
      '[...document.querySelectorAll("button")].some(b => b.textContent.trim() === "Reset" && b.disabled)',
    ),
  );
  await goto("/", "Architektura");
  await until(() => evaluate(`document.title === ${JSON.stringify(title)}`));
  check("saved CMS content reaches public page", true);
  check(
    "public layout restored after CMS",
    await evaluate(
      '!!document.querySelector(".site-header") && !!getComputedStyle(document.documentElement).getPropertyValue("--dark-background").trim()',
    ),
  );
  check("CMS has no runtime exceptions", errors.length === 0);
  await fs.writeFile(
    path.join(out, "cms-browser-results.json"),
    JSON.stringify(
      { passed: checks.length, checks, errors, imageResponses },
      null,
      2,
    ),
  );
} catch (error) {
  const state = socket
    ? await evaluate(
        '({text:document.body.innerText, ready:document.readyState, cssToken:getComputedStyle(document.documentElement).getPropertyValue("--dark-background"), stylesheets:[...document.styleSheets].map(s=>s.href), inputs:[...document.querySelectorAll("input")].map(i=>({value:i.value,type:i.type})), buttons:[...document.querySelectorAll("button")].map(b=>({text:b.textContent,disabled:b.disabled}))})',
        5000,
      ).catch(() => null)
    : null;
  await fs.writeFile(
    path.join(out, "cms-browser-failure.json"),
    JSON.stringify({ message: error.message, checks, errors, state }, null, 2),
  );
  console.error(error);
  process.exitCode = 1;
} finally {
  stopMemoryMonitor();
  if (edited) await fs.writeFile("content/site.json", original);
  if (appearanceEdited)
    await fs.writeFile("content/appearance.json", originalAppearance);
  if (fixtureCreated) await fs.rm(appearanceFixture, { force: true });
  socket?.close();
  await closeTestChrome(chrome, profile);
}
