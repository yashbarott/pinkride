import { describe, expect, it } from "vitest";

import { isDemoMode } from "@/lib/runtime-mode";

describe("deployment mode", () => {
  it.each([
    ["development", "demo", true],
    ["staging", "demo", true],
    ["staging", "production", false],
    ["production", "demo", false],
    ["production", "production", false],
  ] as const)("resolves %s / %s to demo=%s", (environment, mode, expected) => {
    expect(isDemoMode(environment, mode)).toBe(expected);
  });
});