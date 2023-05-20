import type { Match } from '@/rating/match'
import { Category } from '@/rating/match'
import Color from 'color'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { match } from './mapper'

export class Store {
  public coachName: string

  public fumbblMatches: Ref<FumbblMatch[]>

  public matches: Match[] = []

  configs: GraphConfig[] = [new GraphConfig(Color.rgb({ r: 0, g: 0, b: 0 }), [])]

  constructor(coachName: string) {
    this.coachName = coachName
    this.fumbblMatches = ref([])
  }

  init() {
    this.matches = this.fumbblMatches.value
      .map((fumbblMatch) => match(fumbblMatch, this.coachName))
      .sort((a: Match, b: Match) => {
        return a.id - b.id
      })
  }

  graphs(): Graph[] {
    return this.configs.map((config) => new Graph(config.color, this.accumulated(this.matches)))
  }

  private accumulated(matches: Match[]): DataPoint[] {
    let accumulatedScore: number = 0

    return matches.map((match, index) => {
      accumulatedScore += match.score
      return { index: index, ratio: Math.round((accumulatedScore / (index + 1)) * 10000) / 100 }
    })
  }
}

export class GraphConfig {
  categories: Category[]
  color: Color

  constructor(color: Color, categories: Category[]) {
    this.color = color
    this.categories = categories
  }
}

export class Graph {
  dataPoints: DataPoint[]
  color: Color

  constructor(color: Color, dataPoints: DataPoint[]) {
    this.color = color
    this.dataPoints = dataPoints
  }
}

export type DataPoint = {
  index: number
  ratio: number
}
