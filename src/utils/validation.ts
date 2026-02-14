import { PrequitoError } from "./errors.js";

const GIT_HASH_PATTERN = /^[a-f0-9]{4,40}$/i;
// eslint-disable-next-line no-control-regex
const GIT_REF_FORBIDDEN_CHARS = /[\x00-\x1f\x7f ~^:?*[\\]/;
const GIT_REF_FORBIDDEN_SEQUENCES = /\.\.|\.lock(\/|$)|@\{|\/\//;

export function validateHash(hash: string): void {
    if (!GIT_HASH_PATTERN.test(hash)) {
        throw new PrequitoError(
            `Invalid git hash: "${hash}". Expected 4-40 hexadecimal characters.`
        );
    }
}

export function validateRefName(name: string, type: string): void {
    if (!name || name.trim() === "") {
        throw new PrequitoError(`${type} name cannot be empty.`);
    }

    if (name.startsWith("-")) {
        throw new PrequitoError(
            `Invalid ${type} name: "${name}". Cannot start with '-'.`
        );
    }

    if (name.endsWith(".")) {
        throw new PrequitoError(
            `Invalid ${type} name: "${name}". Cannot end with '.'.`
        );
    }

    if (name.endsWith("/")) {
        throw new PrequitoError(
            `Invalid ${type} name: "${name}". Cannot end with '/'.`
        );
    }

    if (GIT_REF_FORBIDDEN_CHARS.test(name)) {
        throw new PrequitoError(
            `Invalid ${type} name: "${name}". Contains forbidden characters.`
        );
    }

    if (GIT_REF_FORBIDDEN_SEQUENCES.test(name)) {
        throw new PrequitoError(
            `Invalid ${type} name: "${name}". Contains forbidden pattern.`
        );
    }
}

export function validateBranchName(branch: string): void {
    validateRefName(branch, "Branch");
}

export function validateTagName(tag: string): void {
    validateRefName(tag, "Tag");
}
