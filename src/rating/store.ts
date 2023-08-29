import type { Category, Match } from '@/rating/match'
import Color from 'color'
import { reactive } from 'vue'
import { match, randomColor } from './mapper'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import { Line } from '@observablehq/plot'
import * as Plot from '@observablehq/plot'

function updateCounter() {
  const { modificationCounter } = storeToRefs(useMatchStore())
  modificationCounter.value += 1
}

export abstract class MatchProvider {
  abstract matches(): Match[]

  abstract matchCounts: Map<Category, number>
}

export class Store extends MatchProvider {
  public coachName: string

  public providedMatches: Match[]
  public categories: Category[]

  configs: GraphConfig[] = []
  public ready = false
  private configCounter = 0
  public matchCounts: Map<Category, number>

  constructor(coachName: string) {
    super()
    this.coachName = coachName
    this.providedMatches = reactive([])
    this.categories = reactive([])
    this.matchCounts = reactive(new Map())
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
      this.providedMatches,
      this.matchCounts
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

    const oldCount = this.matchCounts.get(newMatch.category) || 0

    this.matchCounts.set(newMatch.category, oldCount + 1)
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
  public matchCounts: Map<Category, number>
  private line: Line

  constructor(
    coachName: string,
    configNumber: number,
    color: Color,
    categories: Category[],
    matches: Match[],
    matchCounts: Map<Category, number>
  ) {
    super()
    this.coachName = coachName
    this.configNumber = configNumber
    this.color = color
    this.categories = categories
    this.providedMatches = matches
    this.dataPoints = []
    this.filteredMatches = []
    this.line = Plot.line()
    this.matchCounts = reactive(new Map<Category, number>(matchCounts))
    this.update(false)
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
    this.updateLine()
    updateCounter()
  }

  hexColor() {
    return this.color.hex()
  }

  private update(updateCounts: boolean = true) {
    this.filteredMatches = this.providedMatches.filter(
      (match) => this.categories.indexOf(match.category) > -1
    )
    this.dataPoints = this.accumulated()
    this.updateLine()
    if (updateCounts) {
      for (const key of this.matchCounts.keys()) {
        this.matchCounts.set(key, 0)
      }
      this.filteredMatches.forEach((match) => {
        const category = match.category
        const oldCount = this.matchCounts.get(category) || 0
        this.matchCounts.set(category, oldCount + 1)
      })
    }
    updateCounter()
  }

  private updateLine(): void {
    this.line = Plot.line(this.dataPoints, {
      x: 'index',
      y: 'ratio',
      z: this.coachName + this.configNumber,
      title: 'title',
      stroke: this.color.rgb().string()
    })
  }

  matches(): Match[] {
    return this.filteredMatches
  }

  graph(): Graph {
    return new Graph(this.dataPoints, this.line)
  }

  private accumulated(): DataPoint[] {
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
  line: Line

  constructor(dataPoints: DataPoint[], line: Line) {
    this.dataPoints = dataPoints
    this.line = line
  }
}

export type DataPoint = {
  index: number
  ratio: number
  title: string
}
