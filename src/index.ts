export {
  parseTemplate,
  renderTemplate,
  mergeContext,
} from "./template/engine.js";
export {
  loadConfig,
  loadConfigOrDefault,
  writeConfig,
} from "./config/loader.js";
export type {
  PrequitoConfig,
  PrequitoFeatures,
  ShortcodeEntry,
} from "./config/types.js";
export { generateTemplate } from "./config/types.js";
export type { TemplateContext, ParsedTemplate } from "./template/engine.js";
