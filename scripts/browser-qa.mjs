import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
const base = process.env.QA_URL || "http://127.0.0.1:3000";
const out = path.resolve("docs/qa-netlify");
await fs.mkdir(out, { recursive: true });
const profile = await fs.mkdtemp(path.join(os.tmpdir(), "archi-browser-"));
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--remote-debugging-address=127.0.0.1",
    "--remote-debugging-port=9223",
    "--user-data-dir=" + profile,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
let socket;
let id = 0;
const pending = new Map();
const errors = [];
const failed = [];
const checks = [];
async function until(fn, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const result = await fn();
      if (result) return result;
    } catch {}
    await pause(100);
  }
  throw new Error("Timed out waiting for browser or page");
}
try {
  await until(async () =>
    fetch("http://127.0.0.1:9223/json/version").then((r) => r.ok),
  );
  const target = await fetch("http://127.0.0.1:9223/json/new?about:blank", {
    method: "PUT",
  }).then((r) => r.json());
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id) {
      const p = pending.get(msg.id);
      if (p) {
        pending.delete(msg.id);
        msg.error
          ? p.reject(new Error(JSON.stringify(msg.error)))
          : p.resolve(msg.result);
      }
    } else if (msg.method === "Runtime.exceptionThrown")
      errors.push(msg.params.exceptionDetails);
    else if (
      msg.method === "Runtime.consoleAPICalled" &&
      msg.params.type === "error"
    )
      errors.push(msg.params.args.map((a) => a.value || a.description));
    else if (msg.method === "Network.loadingFailed" && !msg.params.canceled)
      failed.push(msg.params);
  };
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const key = ++id;
      pending.set(key, { resolve, reject });
      socket.send(JSON.stringify({ id: key, method, params }));
      setTimeout(() => {
        if (pending.has(key)) {
          pending.delete(key);
          reject(new Error("CDP timeout " + method));
        }
      }, 20000).unref();
    });
  }
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails)
      throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function ready() {
    await until(() =>
      evaluate(
        'document.readyState === "complete" && !!document.querySelector("main")',
      ),
    );
    await evaluate("document.fonts.ready.then(()=>true)");
    await evaluate(
      'Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{})})).then(()=>true)',
    );
  }
  async function goto(route) {
    await send("Page.navigate", { url: base + route });
    await until(() =>
      evaluate("location.pathname === " + JSON.stringify(route.split("#")[0])),
    );
    await ready();
  }
  async function screenshot(name) {
    const metrics = await send("Page.getLayoutMetrics");
    const shot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: metrics.cssContentSize.width,
        height: metrics.cssContentSize.height,
        scale: 1,
      },
    });
    await fs.writeFile(path.join(out, name), Buffer.from(shot.data, "base64"));
  }
  async function check(name, condition) {
    assert.ok(condition, name);
    checks.push(name);
    console.log("OK", name);
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  for (const width of [390, 768, 1024, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await goto("/");
    await evaluate("window.scrollTo(0,0)");
    const home = await evaluate(
      '({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll("h1").length,cards:[...document.querySelectorAll(".project-card")].map(a=>({href:a.getAttribute("href"),src:a.querySelector("img").getAttribute("src")})),hero:(()=>{const i=document.querySelector(".hero img");return {width:i.clientWidth,height:i.clientHeight,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,objectFit:getComputedStyle(i).objectFit}})(),headFont:getComputedStyle(document.querySelector("h1")).fontFamily,bodyFont:getComputedStyle(document.body).fontFamily,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),reduced:getComputedStyle(document.documentElement).scrollBehavior})',
    );
    await fs.writeFile(
      path.join(out, "layout-" + width + ".json"),
      JSON.stringify(
        {
          ...home,
          overflow: await evaluate(
            '[...document.querySelectorAll("body *")].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})).slice(0,30)',
          ),
        },
        null,
        2,
      ),
    );
    await screenshot("debug-" + width + ".png");
    await check(
      width + " wide cover preserves whole building",
      await evaluate(
        'getComputedStyle([...document.querySelectorAll(".project-card")].find(a=>a.getAttribute("href").endsWith("/dom-mazowieckie")).querySelector("img")).objectFit==="contain"',
      ),
    );
    await check(width + " no horizontal overflow", home.scroll <= home.width);
    await check(
      width + " one H1 and six linked cards",
      home.h1 === 1 && home.cards.length === 6,
    );
    await check(
      width + " hero preserves 16:9",
      Math.abs(home.hero.width / home.hero.height - 16 / 9) < 0.01,
    );
    await check(width + " all images loaded", home.images);
    await check(
      width + " actual local fonts applied",
      home.headFont.includes("montserrat") && home.bodyFont.includes("ptSans"),
    );
    await check(width + " reduced motion", home.reduced === "auto");
    await fs.writeFile(
      path.join(out, "layout-" + width + ".json"),
      JSON.stringify(home, null, 2),
    );
    if (width === 390 || width === 1440)
      await screenshot("home-" + width + ".png");
    if (width === 390) {
      await evaluate('document.querySelector(".menu-toggle").focus()');
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        text: "\r",
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13,
        key: "Enter",
        code: "Enter",
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Enter",
        code: "Enter",
      });
      await until(() => evaluate('!!document.querySelector(".mobile-menu")'));
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        windowsVirtualKeyCode: 9,
        nativeVirtualKeyCode: 9,
        key: "Tab",
        code: "Tab",
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        windowsVirtualKeyCode: 9,
        nativeVirtualKeyCode: 9,
        key: "Tab",
        code: "Tab",
      });
      await check(
        "mobile menu keyboard focus remains inside dialog",
        await evaluate(
          'document.querySelector(".mobile-menu").contains(document.activeElement)',
        ),
      );
      await check(
        "mobile menu opens with dialog",
        await evaluate(
          'document.querySelector(".mobile-menu").getAttribute("role")==="dialog"',
        ),
      );
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Escape",
        code: "Escape",
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Escape",
        code: "Escape",
      });
      await until(() => evaluate('!document.querySelector(".mobile-menu")'));
      await check(
        "Escape closes and returns focus",
        await evaluate(
          'document.activeElement===document.querySelector(".menu-toggle")',
        ),
      );
      await evaluate('document.querySelector(".menu-toggle").click()');
      await until(() => evaluate('!!document.querySelector(".mobile-menu")'));
      await evaluate(
        '[...document.querySelectorAll(".mobile-menu a")].find(a=>a.hash==="#about").click()',
      );
      await until(() => evaluate('!document.querySelector(".mobile-menu")'));
      await check(
        "menu link closes and anchor visible",
        await evaluate(
          'document.querySelector("#about").getBoundingClientRect().top>=68',
        ),
      );
    }
  }
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await goto("/projekty");
  const catalog = JSON.parse(
    await fs.readFile("lib/project-catalog.json", "utf8"),
  );
  const visible = catalog.filter(
    (p) => p.publicationStatus !== "pending-confirmation",
  );
  for (const label of [
    "Domy",
    "Obiekty usługowe",
    "Wnętrza",
    "Przestrzenie publiczne",
    "Przebudowy",
    "Wszystkie",
  ]) {
    const count =
      label === "Wszystkie"
        ? visible.length
        : visible.filter((p) => p.category === label).length;
    await evaluate(
      '[...document.querySelectorAll(".filters button")].find(b=>b.textContent===' +
        JSON.stringify(label) +
        ").click()",
    );
    await until(() =>
      evaluate('document.querySelectorAll(".project-card").length===' + count),
    );
    await check(
      "filtr " + label,
      (await evaluate('document.querySelectorAll(".project-card").length')) ===
        count,
    );
  }
  const slugs = catalog.map((p) => p.slug);
  for (const slug of slugs) {
    const response = await fetch(base + "/projekty/" + slug);
    await check("direct route " + slug, response.status === 200);
    await goto("/projekty/" + slug);
    await send("Page.reload");
    await ready();
    await check(
      "gallery natural proportions " + slug,
      await evaluate(
        '[...document.querySelectorAll(".gallery-image>img")].every(i=>Math.abs(i.clientWidth/i.clientHeight-i.naturalWidth/i.naturalHeight)<.02)',
      ),
    );
    await check(
      "gallery loads after refresh " + slug,
      await evaluate(
        "[...document.images].every(i=>i.complete&&i.naturalWidth>0)",
      ),
    );
  }
  await goto("/projekty/kuchnia-1");
  await screenshot("gallery-desktop.png");
  await evaluate('document.querySelector(".gallery-image").click()');
  await until(() => evaluate('!!document.querySelector(".lightbox")'));
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "ArrowRight",
    code: "ArrowRight",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "ArrowRight",
    code: "ArrowRight",
  });
  await until(() =>
    evaluate(
      'document.querySelector(".lightbox-controls p").textContent.startsWith("2")',
    ),
  );
  await check("lightbox arrow navigation", true);
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
  });
  await until(() => evaluate('!document.querySelector(".lightbox")'));
  await until(() =>
    evaluate(
      'document.activeElement===document.querySelector(".gallery-image")',
    ),
  );
  await check(
    "gallery Escape returns focus to opened image",
    await evaluate(
      'document.activeElement===document.querySelector(".gallery-image")',
    ),
  );
  await check(
    "unknown route returns HTTP 404",
    (await fetch(base + "/projekty/nieznany-projekt")).status === 404,
  );
  await goto("/");
  await evaluate('document.querySelector("form").requestSubmit()');
  await until(() =>
    evaluate('document.querySelectorAll(".field-error").length>=4'),
  );
  await check(
    "form Polish errors and focus",
    await evaluate(
      'document.querySelectorAll(".field-error").length>=4 && document.activeElement.id==="contact-name"',
    ),
  );
  await check(
    "correct contact destinations",
    await evaluate(
      '["tel:+48662477959","mailto:pcywinska.arch@gmail.com","https://maps.app.goo.gl/YPg6NKZmTWbV9Lct9"].every(href=>[...document.links].some(a=>a.getAttribute("href")===href))',
    ),
  );
  const bad = await fetch(base + "/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  await check("server rejects invalid data", bad.status === 400);
  const unavailable = await fetch(base + "/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Test lokalny",
      email: "qa@example.test",
      phone: "",
      projectType: "Dom",
      message: "Dane testowe. Nie wysyłaj tej wiadomości.",
    }),
  });
  await check(
    "unconfigured delivery returns 503 without false success",
    unavailable.status === 503,
  );
  await check(
    "preview noindex header",
    (await fetch(base)).headers.get("x-robots-tag") === "noindex, nofollow",
  );
  await check(
    "preview robots disallow",
    (await fetch(base + "/robots.txt").then((r) => r.text())).includes(
      "Disallow: /",
    ),
  );
  await check("no browser JS errors", errors.length === 0);
  await check("no failed resources", failed.length === 0);
  await fs.writeFile(
    path.join(out, "browser-results.json"),
    JSON.stringify({ passed: checks.length, checks, errors, failed }, null, 2),
  );
  console.log("Browser checks passed:", checks.length);
} catch (error) {
  await fs.writeFile(
    path.join(out, "browser-failure.json"),
    JSON.stringify({ message: error.message, checks, errors, failed }, null, 2),
  );
  console.error(error);
  process.exitCode = 1;
} finally {
  socket?.close();
  chrome.kill();
}
