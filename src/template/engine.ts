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

export function renderTemplate(
  template: string,
  context: TemplateContext,
  message?: string
): string {
  const parsed = parseTemplate(template);

  const missing = parsed.variables.filter((v) => !(v in context));
  if (missing.length > 0) {
    throw new TemplateMissingVariableError(missing);
  }

  let result = template.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
    return context[varName];
  });

  if (parsed.messagePlaceholder) {
    if (!message) {
      throw new TemplateMissingMessageError(parsed.messagePlaceholder);
    }
    result = result.replace(/<\w+>/, message);
  }

  return result;
}

export function mergeContext(
  defaults: TemplateContext,
  overrides: TemplateContext
): TemplateContext {
  return { ...defaults, ...overrides };
}
