export interface PrequitoConfig {
  template: string;
  defaults: Record<string, string>;
}

export const DEFAULT_CONFIG: PrequitoConfig = {
  template: "{{type}}: <message>",
  defaults: {
    type: "feat",
  },
};

export const CONFIG_PATHS = [
  ".preguitorc",
  ".preguitorc.json",
  ".config/preguito/config.json",
] as const;
