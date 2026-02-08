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
export type { PrequitoConfig } from "./config/types.js";
export type { TemplateContext, ParsedTemplate } from "./template/engine.js";
