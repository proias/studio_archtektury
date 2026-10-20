// Wyłącznie lokalna zgodność Windows: złącza katalogów nie wymagają prawa do symlinków.
// Nie zmienia konfiguracji systemu. Dotyczy tylko .next/standalone i kopii .netlify/functions-internal.
if (process.platform === "win32") {
  const fs = require("node:fs");
  const fsp = require("node:fs/promises");
  const path = require("node:path");
  const original = fsp.symlink.bind(fsp);
  const originalCopy = fsp.cp.bind(fsp);
  const functionOutput =
    path
      .resolve(process.cwd(), ".netlify", "functions-internal")
      .toLowerCase() + path.sep;
  fsp.cp = function (source, destination, options = {}) {
    const dest = path.resolve(String(destination)).toLowerCase() + path.sep;
    return originalCopy(
      source,
      destination,
      dest.startsWith(functionOutput)
        ? { ...options, dereference: true, verbatimSymlinks: false }
        : options,
    );
  };
  const output =
    path.resolve(process.cwd(), ".next", "standalone").toLowerCase() + path.sep;
  fsp.symlink = async function (target, destination, type) {
    const dest = path.resolve(String(destination));
    if (!dest.toLowerCase().startsWith(output))
      return original(target, destination, type);
    const source = path.resolve(path.dirname(dest), String(target));
    if ((await fsp.stat(source)).isDirectory())
      return original(source, dest, "junction");
    return fsp.copyFile(source, dest, fs.constants.COPYFILE_EXCL);
  };
  fs.symlink = function (target, destination, type, callback) {
    if (typeof type === "function") {
      callback = type;
      type = undefined;
    }
    fsp.symlink(target, destination, type).then(() => callback(null), callback);
  };
}

require("node:module").syncBuiltinESMExports();
