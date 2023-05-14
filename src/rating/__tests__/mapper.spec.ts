import { describe, it, expect } from "vitest";

import { category, score } from "../mapper";
import { Category, Score } from "../match";

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
      { match: { division: "Stunty Leeg", scheduler: "None" } as FumbblMatch, category: Category.Stunty_Leeg },
      { match: { division: "DivX Legacy", scheduler: "None" } as FumbblMatch, category: Category.DivX },
      { match: { division: "Academy", scheduler: "None" } as FumbblMatch, category: Category.Academy },
      { match: { division: "Faction", scheduler: "None" } as FumbblMatch, category: Category.Faction },
      { match: { division: "FFB Test", scheduler: "None" } as FumbblMatch, category: Category.FFB_Test },
      {
        match: { division: "Fantasy Football", scheduler: "None" } as FumbblMatch,
        category: Category.Fantasy_Football
      },
      { match: { division: "LRB4", scheduler: "None" } as FumbblMatch, category: Category.LRB4 },
      { match: { division: "Transfer Division", scheduler: "None" } as FumbblMatch, category: Category.Transfer },
      { match: { division: "Transfer Division 2", scheduler: "None" } as FumbblMatch, category: Category.Transfer2 },
      { match: { division: "Ladder", scheduler: "None" } as FumbblMatch, category: Category.Ladder },
      { match: { division: "Unknown", scheduler: "None" } as FumbblMatch, category: Category.Unknown }
    ])("maps $match.division and $match.scheduler to $category", (param) => {
      expect(category(param.match)).toBe(param.category);
    });
  });

  describe("score", () => {
    const coachName = "coach";
    const opponentName = "opponent";

    it.each([
      {
        match: {
          team1: {
            coach: { name: coachName },
            score: 1
          },
          team2: {
            coach: { name: opponentName },
            score: 1
          }

        } as FumbblMatch, score: Score.Draw,
        description: "1:1 as home",
        resultString: "Draw"
      },
      {
        match: {
          team1: {
            coach: { name: opponentName },
            score: 2
          },
          team2: {
            coach: { name: coachName },
            score: 2
          }

        } as FumbblMatch, score: Score.Draw,
        description: "2:2 as away",
        resultString: "Draw"
      },
      {
        match: {
          team1: {
            coach: { name: opponentName },
            score: 2
          },
          team2: {
            coach: { name: coachName },
            score: 1
          }

        } as FumbblMatch, score: Score.Loss,
        description: "2:1 as away",
        resultString: "Loss"
      },
      {
        match: {
          team1: {
            coach: { name: coachName },
            score: 0
          },
          team2: {
            coach: { name: opponentName },
            score: 3
          }

        } as FumbblMatch, score: Score.Loss,
        description: "0:3 as home",
        resultString: "Loss"
      },
      {
        match: {
          team1: {
            coach: { name: opponentName },
            score: 0
          },
          team2: {
            coach: { name: coachName },
            score: 2
          }

        } as FumbblMatch, score: Score.Win,
        description: "0:2 as away",
        resultString: "Win"
      },
      {
        match: {
          team1: {
            coach: { name: coachName },
            score: 3
          },
          team2: {
            coach: { name: opponentName },
            score: 1
          }

        } as FumbblMatch, score: Score.Win,
        description: "3:1 as home",
        resultString: "Win"
      }

    ])("maps $description to $resultString", (param) => {
      expect(score(param.match, coachName)).toBe(param.score)
    });
  });
});