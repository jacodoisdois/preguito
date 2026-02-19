import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/cli.ts"],
    format: "esm",
    banner: { js: "#!/usr/bin/env node" },
  },
  {
    entry: { "cli-sea": "src/cli.ts" },
    format: "cjs",
    noExternal: [/.*/],
    inlineOnly: false,
  },
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
  },
]);
