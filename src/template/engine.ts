import {
  TemplateMissingVariableError,
  TemplateMissingMessageError,
} from "../utils/errors.js";

export interface TemplateContext {
  [key: string]: string;
}

export interface ParsedTemplate {
  variables: string[];
  messagePlaceholder: string | null;
}

const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g;
const MESSAGE_PLACEHOLDER_PATTERN = /<(\w+)>/;

export function parseTemplate(template: string): ParsedTemplate {
  const variables: string[] = [];
  let match: RegExpExecArray | null;

  const pattern = new RegExp(VARIABLE_PATTERN.source, "g");
  while ((match = pattern.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  const messageMatch = MESSAGE_PLACEHOLDER_PATTERN.exec(template);
  const messagePlaceholder = messageMatch ? messageMatch[1] : null;

  return { variables, messagePlaceholder };
}

function cleanupEmptyPatterns(text: string): string {
  return (
    text
      // Remove empty parentheses: () → ""
      .replace(/\(\s*\)/g, "")
      // Remove empty brackets: [] → ""
      .replace(/\[\s*\]/g, "")
      // Remove empty braces: {} → ""
      .replace(/\{\s*\}/g, "")
      // Normalize multiple spaces: "feat  : msg" → "feat : msg"
      .replace(/\s+/g, " ")
      // Remove space before colon: "feat : msg" → "feat: msg"
      .replace(/\s+:/g, ":")
      .trim()
  );
}

export function renderTemplate(
  template: string,
  context: TemplateContext,
  message?: string
): string {
  const parsed = parseTemplate(template);

  // Allow optional variables - if not in context, replace with empty string
  // This enables environment to be optional
  let result = template.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
    return context[varName] || "";
  });

  if (parsed.messagePlaceholder) {
    if (!message) {
      throw new TemplateMissingMessageError(parsed.messagePlaceholder);
    }
    result = result.replace(/<\w+>/, message);
  }

  // Clean up empty patterns from optional variables
  result = cleanupEmptyPatterns(result);

  return result;
}

export function mergeContext(
  defaults: TemplateContext,
  overrides: TemplateContext
): TemplateContext {
  return { ...defaults, ...overrides };
}
