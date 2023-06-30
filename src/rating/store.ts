import type { Category, Match } from '@/rating/match'
import Color from 'color'
import type { UnwrapNestedRefs } from 'vue'
import { reactive } from 'vue'
import { match, randomColor } from './mapper'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

export class Store {
  public coachName: string

  public matches: UnwrapNestedRefs<Match[]>
  public categories: UnwrapNestedRefs<Category[]>

  configs: GraphConfig[] = []

  private readonly matchStore

  constructor(coachName: string) {
    this.coachName = coachName
    this.matches = reactive([])
    this.categories = reactive([])
    this.matchStore = useMatchStore()
  }

  init() {
    this.matches.sort((a: Match, b: Match) => {
      return a.id - b.id
    })
    this.addConfig(
      new GraphConfig(
        randomColor(),
        this.categories.filter((cat) => cat.valid)
      )
    )
  }

  addConfig(config: GraphConfig) {
    this.configs.push(config)
    const { modificationCounter } = storeToRefs(this.matchStore)
    modificationCounter.value += 1
  }

  graphs(): Graph[] {
    return this.configs.map(
      (config, configIndex) =>
        new Graph(
          config.color,
          this.accumulated(
            this.matches.filter((match) => config.categories.indexOf(match.category) > -1),
            configIndex
          )
        )
    )
  }

  addMatch(fumbblMatch: FumbblMatch) {
    const newMatch: Match = match(fumbblMatch, this.coachName)
    this.matches.push(newMatch)

    if (this.categories.indexOf(newMatch.category) < 0) {
      this.categories.push(newMatch.category)
      this.categories.sort((a: Category, b: Category) => a.toString().localeCompare(b.toString()))
    }
  }

  private accumulated(matches: Match[], configIndex: number): DataPoint[] {
    let accumulatedScore: number = 0

    return matches.map((match, index) => {
      accumulatedScore += match.score
      return {
        index: index + 1,
        ratio: Math.round((accumulatedScore / (index + 1)) * 10000) / 10000,
        title: this.coachName + '_' + configIndex
      }
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
  title: string
}
