export interface ShortcodeEntry {
  key: string;
  label: string;
}

export interface PrequitoFeatures {
  cardId: boolean;
  type: boolean;
  environment: boolean;
}

export interface PrequitoConfig {
  template: string;
  features: PrequitoFeatures;
  types: ShortcodeEntry[];
  environments: ShortcodeEntry[];
  defaults: Record<string, string>;
}

export const PREDEFINED_TYPES: ShortcodeEntry[] = [
  { key: "f", label: "feat" },
  { key: "x", label: "fix" },
  { key: "c", label: "chore" },
  { key: "t", label: "test" },
  { key: "l", label: "lint" },
  { key: "r", label: "refactor" },
  { key: "o", label: "docs" },
  { key: "y", label: "style" },
  { key: "e", label: "perf" },
  { key: "b", label: "build" },
];

export const PREDEFINED_ENVIRONMENTS: ShortcodeEntry[] = [
  { key: "p", label: "prd" },
  { key: "u", label: "uat" },
  { key: "h", label: "homolog" },
  { key: "d", label: "dev" },
  { key: "s", label: "staging" },
];

export function generateTemplate(
  features: PrequitoFeatures,
  hasPrefix: boolean
): string {
  const { cardId, type, environment } = features;

  const card = cardId
    ? hasPrefix
      ? "[{{prefix}}-{{card_id}}]"
      : "[{{card_id}}]"
    : "";

  const typeEnv = type && environment
    ? "{{type}}({{environment}}):"
    : type
      ? "{{type}}:"
      : environment
        ? "({{environment}}):"
        : "";

  const parts = [card, typeEnv, "<message>"].filter((p) => p !== "");
  return parts.join(" ");
}

export const DEFAULT_CONFIG: PrequitoConfig = {
  template: "{{type}}: <message>",
  features: {
    cardId: false,
    type: true,
    environment: false,
  },
  types: [
    { key: "f", label: "feat" },
    { key: "x", label: "fix" },
    { key: "c", label: "chore" },
    { key: "t", label: "test" },
    { key: "r", label: "refactor" },
    { key: "o", label: "docs" },
  ],
  environments: [],
  defaults: {},
};

export const CONFIG_PATHS = [
  ".preguitorc",
  ".preguitorc.json",
  ".config/preguito/config.json",
] as const;
