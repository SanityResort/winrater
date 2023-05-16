import type { Match } from "@/rating/match";
import { Category, Score } from "@/rating/match";
import Color from "color";

export class Store {

  private coachName: string;

  private matches: Match[];

  configs: GraphConfig[] = [new GraphConfig(Color.rgb({r: 0, g: 0, b: 0 }), [])];

  constructor(coachName: string, matches: Match[]) {
    this.coachName = coachName;
    this.matches = matches.sort((a: Match, b: Match) => {
      return a.id - b.id;
    });
  }

  graphs(): Graph[] {
    return [];
  }
}

export class GraphConfig {
  private categories: Category[];
  private color: Color;

  constructor(color: Color, categories: Category[]) {
    this.color = color;
    this.categories = categories;
  }
}

export class Graph {
  dataPoints: DataPoint[];
  color: Color;

  constructor(color: Color, dataPoints: DataPoint[]) {
    this.color = color;
    this.dataPoints = dataPoints;
  }
}

export type DataPoint = {
  index: number, score: Score
}