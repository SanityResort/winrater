import { beforeEach, describe, expect, it } from "vitest";
import { Graph, GraphConfig, Store } from "../store";
import type { Match } from "../match";
import { Category, Score } from "../match";
import Color from "color";

describe("Rating Store", () => {
  const coachName = "coach";
  const color = Color.rgb({ r: 0, g: 0, b: 0 });

  const matches: Match[] = [
    {
      id: 51,
      category: Category.Blackbox,
      score: Score.Draw
    },
    {
      id: 4,
      category: Category.Competitive,
      score: Score.Win
    },
    {
      id: 12,
      category: Category.League,
      score: Score.Loss
    },
    {
      id: 30,
      category: Category.Blackbox,
      score: Score.Draw
    },
    {
      id: 23,
      category: Category.League,
      score: Score.Win
    }
  ];
  let store: Store;
  beforeEach(() => {
    store = new Store(coachName, matches);

  });
  describe("configs", () => {
    it("is initialized with default config", () => {
      expect(store.configs.length).toBe(1);
      expect(store.configs[0]).toStrictEqual(new GraphConfig(color, []));
    });
  });

  describe("graphs", () => {
    it("returns data points for all matches sorted properly for default config", () => {
      const graphs = store.graphs();
      expect(graphs.length).toBe(1);
      expect(graphs[0]).toStrictEqual(new Graph(color, [
        { index: 0, score: 1 },
        { index: 1, score: 0.5 },
        { index: 2, score: 2 / 3 },
        { index: 3, score: 2.5 / 4 },
        { index: 4, score: 3 / 5 }
      ]));
    });
  });
});