import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/cli.ts"],
    format: "esm",
  },
  {
    entry: { "cli-sea": "src/cli.ts" },
    format: "cjs",
    noExternal: [/.*/],
  },
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
  },
]);
