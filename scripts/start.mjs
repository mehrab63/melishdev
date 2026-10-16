import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = resolve("."),
  standalone = join(root, ".next/standalone");
if (!existsSync(join(standalone, "server.js")))
  throw new Error("Run npm run build before npm start.");
cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
mkdirSync(join(standalone, ".next"), { recursive: true });
cpSync(join(root, ".next/static"), join(standalone, ".next/static"), {
  recursive: true,
});
const portIndex = process.argv.indexOf("--port");
if (portIndex >= 0) process.env.PORT = process.argv[portIndex + 1];
process.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
await import(pathToFileURL(join(standalone, "server.js")).href);
