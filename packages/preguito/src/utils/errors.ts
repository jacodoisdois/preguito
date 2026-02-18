export class PrequitoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrequitoError";
  }
}

export class TemplateMissingVariableError extends PrequitoError {
  public readonly missingVariables: string[];

  constructor(missing: string[]) {
    super(
      `Missing template variable(s): ${missing.join(", ")}. ` +
        `Provide shortcodes or check your config.`
    );
    this.name = "TemplateMissingVariableError";
    this.missingVariables = missing;
  }
}

export class TemplateMissingMessageError extends PrequitoError {
  constructor(placeholderName: string) {
    super(
      `Template requires a message (the <${placeholderName}> placeholder). ` +
        `Provide it as the last argument(s).`
    );
    this.name = "TemplateMissingMessageError";
  }
}

export class ConfigNotFoundError extends PrequitoError {
  constructor() {
    super(
      `No preguito config found. Run "guito i" to create one, ` +
        `or create ~/.config/preguito/config.json manually.`
    );
    this.name = "ConfigNotFoundError";
  }
}

export class GitOperationError extends PrequitoError {
  public readonly exitCode: number;
  public readonly stderr: string;

  constructor(operation: string, exitCode: number, stderr: string) {
    super(`Git ${operation} failed (exit ${exitCode}): ${stderr.trim()}`);
    this.name = "GitOperationError";
    this.exitCode = exitCode;
    this.stderr = stderr;
  }
}
