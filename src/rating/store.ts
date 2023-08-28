import type { Category, Match } from '@/rating/match'
import Color from 'color'
import { reactive } from 'vue'
import { match, randomColor } from './mapper'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

function updateCounter() {
  const { modificationCounter } = storeToRefs(useMatchStore())
  modificationCounter.value += 1
}

export abstract class MatchProvider {
  abstract matches(): Match[]

  categoryMatches(category: Category): Match[] {
    return this.matches().filter((match) => match.category === category)
  }
}

export class Store extends MatchProvider {
  public coachName: string

  public providedMatches: Match[]
  public categories: Category[]

  configs: GraphConfig[] = []
  public ready = false
  private configCounter = 0

  constructor(coachName: string) {
    super()
    this.coachName = coachName
    this.providedMatches = reactive([])
    this.categories = reactive([])
  }

  init() {
    this.providedMatches.sort((a: Match, b: Match) => {
      return a.id - b.id
    })
    this.ready = true
    this.addConfig()
  }

  addConfig() {
    const config = new GraphConfig(
      this.coachName,
      ++this.configCounter,
      randomColor(),
      this.categories.filter((cat) => cat.valid),
      this.providedMatches
    )

    this.configs.push(config)
  }

  removeConfig(config: GraphConfig) {
    const index = this.configs.indexOf(config)
    if (index >= 0) {
      this.configs.splice(index, 1)
    }
    updateCounter()
  }

  graphs(): Graph[] {
    return this.configs.map((config) => config.graph())
  }

  addMatch(fumbblMatch: FumbblMatch) {
    const newMatch: Match = match(fumbblMatch, this.coachName)
    this.providedMatches.push(newMatch)

    if (this.categories.indexOf(newMatch.category) < 0) {
      this.categories.push(newMatch.category)
      this.categories.sort((a: Category, b: Category) =>
        a.name.toString().localeCompare(b.name.toString())
      )
    }
  }

  matches(): Match[] {
    return this.providedMatches
  }
}

export class GraphConfig extends MatchProvider {
  public categories: Category[]
  private color: Color
  private providedMatches: Match[]
  private filteredMatches: Match[]
  private dataPoints: DataPoint[]
  private readonly coachName: string
  private readonly configNumber: number

  constructor(
    coachName: string,
    configNumber: number,
    color: Color,
    categories: Category[],
    matches: Match[]
  ) {
    super()
    this.coachName = coachName
    this.configNumber = configNumber
    this.color = color
    this.categories = categories
    this.providedMatches = matches
    this.dataPoints = []
    this.filteredMatches = []
    this.update()
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
    this.update()
  }

  public updateHexColor(newColor: string) {
    this.color = this.color.hex(newColor)
    updateCounter()
  }

  hexColor() {
    return this.color.hex()
  }

  private update() {
    this.filteredMatches = this.providedMatches.filter(
      (match) => this.categories.indexOf(match.category) > -1
    )
    this.dataPoints = this.accumulated()
    updateCounter()
  }

  matches(): Match[] {
    return this.filteredMatches
  }

  graph(): Graph {
    return new Graph(this.color, this.dataPoints)
  }

  private accumulated(): DataPoint[] {
    console.log('Accumalted for ' + this.coachName + ' ' + this.configNumber)
    let accumulatedScore: number = 0

    return this.filteredMatches.map((match, index) => {
      accumulatedScore += match.score
      return {
        index: index + 1,
        ratio: Math.round((accumulatedScore / (index + 1)) * 10000) / 10000,
        title: this.coachName + ' #' + this.configNumber
      }
    })
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
