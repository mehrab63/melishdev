import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export const root = fileURLToPath(new URL("../../", import.meta.url));

/** Execute the real non-React modules with isolated environment configuration. */
export function loadTsModule(relativePath, env = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    if (filename.endsWith(".json"))
      return JSON.parse(fs.readFileSync(filename, "utf8"));
    const moduleRecord = { exports: {} };
    cache.set(filename, moduleRecord);
    const source = fs.readFileSync(filename, "utf8");
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
      fileName: filename,
    }).outputText;
    const localRequire = (specifier) => {
      const target = specifier.startsWith("@/")
        ? path.join(root, "src", specifier.slice(2))
        : path.resolve(path.dirname(filename), specifier);
      const resolved = [
        target,
        `${target}.ts`,
        `${target}.json`,
        path.join(target, "index.ts"),
      ].find(
        (candidate) =>
          fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
      );
      if (!resolved) throw new Error(`Unexpected dependency: ${specifier}`);
      return load(resolved);
    };
    vm.runInNewContext(
      compiled,
      {
        exports: moduleRecord.exports,
        module: moduleRecord,
        require: localRequire,
        process: { env: { ...env } },
        URL,
        Intl,
        Date,
      },
      { filename },
    );
    return moduleRecord.exports;
  }
  return load(path.resolve(root, relativePath));
}

export const plain = (value) => JSON.parse(JSON.stringify(value));
