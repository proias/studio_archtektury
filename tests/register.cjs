const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  return resolveFilename.call(
    this,
    request.startsWith("@/")
      ? path.resolve(__dirname, "..", request.slice(2))
      : request,
    parent,
    ...rest,
  );
};
const transpile = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
      resolveJsonModule: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  module._compile(code, filename);
};
require.extensions[".ts"] = transpile;
require.extensions[".tsx"] = transpile;
