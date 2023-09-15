import type { Category, Match } from '@/rating/match'
import Color from 'color'
import { reactive, Ref } from 'vue'
import { match, randomColor } from './mapper'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import * as Plot from '@observablehq/plot'
import { Line } from '@observablehq/plot'

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
  public color: Color
  private readonly providedMatches: Match[]
  private filteredMatches: Match[]
  private dataPoints: DataPoint[]
  private readonly coachName: string
  public readonly configNumber: number
  public matchCounts: Map<Category, number>
  private line: Line
  public settings: Settings

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
    this.providedMatches = matches ? matches : []
    this.dataPoints = []
    this.filteredMatches = []
    this.line = Plot.line()
    this.matchCounts = reactive(new Map<Category, number>(matchCounts))
    this.update(false)
    const matchCount = this.providedMatches.length
    if (this.providedMatches && this.providedMatches.length > 0) {
      const minDate = createStartOfDayDate(this.providedMatches[0].dateTime)
      const maxDate = createEndOfDayDate(this.providedMatches[matchCount - 1].dateTime)

      this.settings = new Settings(
        matchCount,
        this.providedMatches[0].id,
        this.providedMatches[matchCount - 1].id,
        minDate,
        maxDate
      )
    } else {
      this.settings = new Settings(0, 0, 0, new Date(), new Date())
    }
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
      z: this.getTitle(),
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
        title: this.getTitle(),
        id: match.id,
        dateTime: match.dateTime
      }
    })
  }

  public getTitle() {
    return this.coachName + ' #' + this.configNumber
  }

  setCountRange(from: number, to: number, errorMessage: Ref<string>): boolean {
    const res = this.settings.setCountRange(from, to, errorMessage)
    return res
  }

  setIdRange(from: number, to: number, errorMessage: Ref<string>): boolean {
    const res = this.settings.setIdRange(from, to, errorMessage)
    return res
  }

  setDateRange(from: string, to: string, errorMessage: Ref<string>): boolean {
    const res = this.settings.setDateRange(from, to, errorMessage)
    return res
  }

  setWindowSize(size: number) {
    this.settings.setWindowSize(size)
  }

  setRange(range: Range) {
    this.settings.range = range
  }

  setAggregation(aggregation: Aggregation) {
    this.settings.aggregation = aggregation
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
  id: number
  dateTime: Date
}

export class Settings {
  matchCount: number
  minId: number
  maxId: number
  minDate: Date
  maxDate: Date
  countRange: number[]
  idRange: number[]
  dateRange: Date[]
  windowSize: number
  range: Range
  aggregation: Aggregation

  constructor(matchCount: number, minId: number, maxId: number, minDate: Date, maxDate: Date) {
    this.matchCount = matchCount
    this.minId = minId
    this.maxId = maxId
    this.minDate = minDate
    this.maxDate = maxDate
    this.countRange = [Math.min(1, matchCount), matchCount]
    this.idRange = [minId, maxId]
    this.dateRange = [minDate, maxDate]
    this.windowSize = 1
    this.range = Range.COUNT
    this.aggregation = Aggregation.SUM
  }

  setCountRange(from: number, to: number, errorMessage: Ref<string>): boolean {
    const res =
      this.checkOrder(from, to, errorMessage) &&
      this.checkLowerBound(from, 1, '1', errorMessage) &&
      this.checkUpperBound(to, this.matchCount, this.matchCount.toString(), errorMessage)

    if (res) {
      this.countRange = [from, to]
      errorMessage.value = ''
    }

    return res
  }

  setIdRange(from: number, to: number, errorMessage: Ref<string>): boolean {
    const res =
      this.checkOrder(from, to, errorMessage) &&
      this.checkLowerBound(from, this.minId, this.minId.toString(), errorMessage) &&
      this.checkUpperBound(to, this.maxId, this.maxId.toString(), errorMessage)

    if (res) {
      this.idRange = [from, to]
      errorMessage.value = ''
    }

    return res
  }

  setDateRange(from: string, to: string, errorMessage: Ref<string>): boolean {
    const fromDate = createStartOfDayDate(new Date(from))
    const toDate = createEndOfDayDate(new Date(to))

    const res =
      this.checkOrder(from, to, errorMessage) &&
      this.checkLowerBound(
        fromDate,
        this.minDate,
        this.minDate.toISOString().split('T')[0],
        errorMessage
      ) &&
      this.checkUpperBound(
        toDate,
        this.maxDate,
        this.maxDate.toISOString().split('T')[0],
        errorMessage
      )

    if (res) {
      this.dateRange = [fromDate, toDate]
      errorMessage.value = ''
    }

    return res
  }

  setWindowSize(size: number) {
    this.windowSize = size
  }

  getStartDate(): string {
    return this.dateToString(this.dateRange[0])
  }

  getEndDate(): string {
    return this.dateToString(this.dateRange[1])
  }

  private dateToString(date: Date) {
    return date.toISOString().split('T')[0]
  }

  private checkOrder<T>(from: T, to: T, errorMessage: Ref<string>): boolean {
    if (from > to) {
      errorMessage.value = '"From" must not be larger than "to"'
      return false
    }
    return true
  }

  private checkLowerBound<T>(
    from: T,
    minFrom: T,
    limit: string,
    errorMessage: Ref<string>
  ): boolean {
    if (minFrom > from) {
      errorMessage.value = '"From" must not be smaller than ' + limit
      return false
    }

    return true
  }

  private checkUpperBound<T>(to: T, maxTo: T, limit: string, errorMessage: Ref<string>): boolean {
    if (maxTo < to) {
      errorMessage.value = '"To" must not be larger than ' + limit
      return false
    }

    return true
  }
}

function createEndOfDayDate(date: Date) {
  const maxDate = new Date(date)
  maxDate.setUTCHours(23)
  maxDate.setUTCMinutes(59)
  maxDate.setUTCSeconds(59)
  maxDate.setUTCMilliseconds(999)
  return maxDate
}

function createStartOfDayDate(date: Date) {
  const minDate = new Date(date)
  minDate.setUTCHours(0)
  minDate.setUTCMinutes(0)
  minDate.setUTCSeconds(0)
  minDate.setUTCMilliseconds(0)
  return minDate
}

export enum Range {
  COUNT,
  ID,
  DATE
}

export enum Aggregation {
  SUM,
  WINDOW
}
