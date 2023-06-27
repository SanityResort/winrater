import type { Match } from '@/rating/match'
import { Category } from '@/rating/match'
import Color from 'color'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { match, randomColor } from './mapper'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

export class Store {
  public coachName: string

  public matchesRef: Ref<Match[]>

  private matches: Match[] = []

  configs: GraphConfig[] = []

  private readonly matchStore

  constructor(coachName: string) {
    this.coachName = coachName
    this.matchesRef = ref([])
    this.matchStore = useMatchStore()
  }

  init() {
    this.matchesRef.value = this.matchesRef.value.sort((a: Match, b: Match) => {
      return a.id - b.id
    })
    this.matches = this.matchesRef.value
    this.addConfig(new GraphConfig(randomColor(), []))
  }

  addConfig(config: GraphConfig) {
    this.configs.push(config)
    const { modificationCounter } = storeToRefs(this.matchStore)
    modificationCounter.value += 1
  }

  graphs(): Graph[] {
    return this.configs.map(
      (config, configIndex) => new Graph(config.color, this.accumulated(this.matches, configIndex))
    )
  }

  addMatch(fumbblMatch: FumbblMatch) {
    this.matchesRef.value.push(match(fumbblMatch, this.coachName))
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
