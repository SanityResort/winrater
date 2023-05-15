import { describe, it, expect, beforeEach } from "vitest";
import { GraphConfig, Store } from "../store";
import type { Match } from "../match";
import Color from "color";

describe("Rating Store", () => {
  const coachName = "coach";
  const matches: Match[] = [];

  let store: Store;
  beforeEach(() => {
    store = new Store(coachName, matches);
  });

  describe("configs", () => {
    it("is initialized with default config", () => {
      expect(store.configs.length).toBe(1);
      expect(store.configs[0]).toStrictEqual(new GraphConfig(Color.rgb({ r: 0, g: 0, b: 0 }), []));
    });
  });
});