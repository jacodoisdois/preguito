import { describe, it, expect } from "vitest";
import { parseCount } from "../../src/utils/command.js";

describe("parseCount", () => {
    it("returns default value when value is undefined", () => {
        expect(parseCount(undefined)).toBe(1);
    });

    it("returns custom default value when value is undefined", () => {
        expect(parseCount(undefined, 10)).toBe(10);
    });

    it("parses valid positive integers", () => {
        expect(parseCount("5")).toBe(5);
        expect(parseCount("1")).toBe(1);
        expect(parseCount("100")).toBe(100);
    });

    it("throws on zero", () => {
        expect(() => parseCount("0")).toThrow("positive integer");
    });

    it("throws on negative numbers", () => {
        expect(() => parseCount("-1")).toThrow("positive integer");
    });

    it("throws on non-numeric strings", () => {
        expect(() => parseCount("abc")).toThrow("positive integer");
    });

    it("truncates decimal numbers to integer part", () => {
        expect(parseCount("3.5")).toBe(3);
    });

    it("throws on empty string", () => {
        expect(() => parseCount("")).toThrow("positive integer");
    });
});
