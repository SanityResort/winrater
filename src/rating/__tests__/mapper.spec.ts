import { describe, it, expect } from "vitest";

import { category } from "../mapper";
import { Category } from "../match";

describe("Rating Mapper", () => {
  describe("category", () => {
    it.each([
      { match: { division: "Competitive", scheduler: "Blackbox" } as FumbblMatch, category: Category.Blackbox },
      { match: { division: "Competitive", scheduler: "None" } as FumbblMatch, category: Category.Competitive },
      { match: { division: "Competitive", scheduler: "Gamefinder" } as FumbblMatch, category: Category.Competitive },
      { match: { division: "Blackbox", scheduler: "None" } as FumbblMatch, category: Category.Legacy_Blackbox },
      { match: { division: "Blackbox", scheduler: "Gamefinder" } as FumbblMatch, category: Category.Legacy_Blackbox },
      { match: { division: "League", scheduler: "None" } as FumbblMatch, category: Category.League },
      { match: { division: "Ranked", scheduler: "Gamefinder" } as FumbblMatch, category: Category.Ranked },
      { match: { division: "Ranked", scheduler: "None" } as FumbblMatch, category: Category.Ranked },
      { match: { division: "Unranked", scheduler: "None" } as FumbblMatch, category: Category.Unranked },
      { match: { division: "Stunty Leeg", scheduler: "None" } as FumbblMatch, category: Category.StuntyLeeg },
      { match: { division: "DivX Legacy", scheduler: "None" } as FumbblMatch, category: Category.DivX },
      { match: { division: "Academy", scheduler: "None" } as FumbblMatch, category: Category.Academy },
      { match: { division: "Faction", scheduler: "None" } as FumbblMatch, category: Category.Faction },
      { match: { division: "FFB Test", scheduler: "None" } as FumbblMatch, category: Category.FFB_Test },
      { match: { division: "Fantasy Football", scheduler: "None" } as FumbblMatch, category: Category.Fantasy_Football },
      { match: { division: "LRB4", scheduler: "None" } as FumbblMatch, category: Category.LRB4 },
      { match: { division: "Transfer Division", scheduler: "None" } as FumbblMatch, category: Category.Transfer },
      { match: { division: "Transfer Division 2", scheduler: "None" } as FumbblMatch, category: Category.Transfer2 },
      { match: { division: "Ladder", scheduler: "None" } as FumbblMatch, category: Category.Ladder },
      { match: { division: "Unknown", scheduler: "None" } as FumbblMatch, category: Category.Unknown }
    ])("maps $match.division and $match.scheduler to $category", (param) => {
      expect(category(param.match)).toBe(param.category);
    });
  });
});