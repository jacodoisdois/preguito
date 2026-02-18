#!/usr/bin/env node

/**
 * Build a standalone Linux binary using Node.js SEA (Single Executable Application).
 * Requires Node.js >= 25.5.0 (--build-sea support).
 *
 * Usage: node scripts/build-sea.js
 * Output: build/guito (standalone binary)
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const buildDir = resolve(projectRoot, "build");

if (!existsSync(buildDir)) {
  mkdirSync(buildDir, { recursive: true });
}

// Use the CJS bundle for SEA (ESM is not supported in SEA)
const bundledCli = resolve(projectRoot, "dist", "cli-sea.cjs");

const seaConfig = {
  main: bundledCli,
  output: resolve(buildDir, "guito"),
  disableExperimentalSEAWarning: true,
  useCodeCache: true,
};

const seaConfigPath = resolve(buildDir, "sea-config.json");
writeFileSync(seaConfigPath, JSON.stringify(seaConfig, null, 2));

// Resolve real node binary (handles asdf/nvm shims)
let nodeBin = process.execPath;
console.log(`Using node binary: ${nodeBin}`);

console.log("Building standalone binary with Node.js SEA...");
execSync(`"${nodeBin}" --build-sea=${seaConfigPath}`, {
  stdio: "inherit",
  cwd: projectRoot,
});

console.log(`Standalone binary created: ${resolve(buildDir, "guito")}`);
