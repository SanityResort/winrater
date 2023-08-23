import type { Category, Match } from '@/rating/match'
import Color from 'color'
import type { UnwrapNestedRefs } from 'vue'
import { reactive } from 'vue'
import { match, randomColor } from './mapper'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

function updateCounter() {
  const { modificationCounter } = storeToRefs(useMatchStore())
  modificationCounter.value += 1
}

export class Store {
  public coachName: string

  public matches: UnwrapNestedRefs<Match[]>
  public categories: UnwrapNestedRefs<Category[]>

  configs: GraphConfig[] = []

  constructor(coachName: string) {
    this.coachName = coachName
    this.matches = reactive([])
    this.categories = reactive([])
  }

  init() {
    this.matches.sort((a: Match, b: Match) => {
      return a.id - b.id
    })
    this.addConfig()
  }

  addConfig() {
    const config = new GraphConfig(
      randomColor(),
      this.categories.filter((cat) => cat.valid),
      this.matches
    )

    this.configs.push(config)
    updateCounter()
  }
  removeConfig(config: GraphConfig) {
    const index = this.configs.indexOf(config)
    if (index >= 0) {
      this.configs.splice(index, 1)
    }
    updateCounter()
  }

  graphs(): Graph[] {
    return this.configs.map(
      (config, configIndex) =>
        new Graph(config.color, this.accumulated(config.filteredMatches, configIndex))
    )
  }

  addMatch(fumbblMatch: FumbblMatch) {
    const newMatch: Match = match(fumbblMatch, this.coachName)
    this.matches.push(newMatch)

    if (this.categories.indexOf(newMatch.category) < 0) {
      this.categories.push(newMatch.category)
      this.categories.sort((a: Category, b: Category) =>
        a.name.toString().localeCompare(b.name.toString())
      )
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
  private matches: Match[]
  filteredMatches: Match[]

  constructor(color: Color, categories: Category[], matches: Match[]) {
    this.color = color
    this.categories = categories
    this.matches = matches
    this.filteredMatches = this.filterMatches()
  }

  toggleCategory(category: Category) {
    const index = this.categories.indexOf(category)

    if (index >= 0) {
      if (this.categories.length > 1) {
        this.categories.splice(index, 1)
      }
    } else {
      this.categories.push(category)
    }
    this.filteredMatches = this.filterMatches()
    updateCounter()
  }

  public updateHexColor(newColor: string) {
    this.color = this.color.hex(newColor)
    updateCounter()
  }

  hexColor() {
    return this.color.hex()
  }

  private filterMatches(): Match[] {
    return this.matches.filter((match) => this.categories.indexOf(match.category) > -1)
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
