import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Graph, GraphConfig, Store } from '../store'
import type { Match } from '../match'
import { Blackbox, Competitive, FFB_Test, League, Score } from '../match'
import Color from 'color'
import { match, randomColor } from '../mapper'
import { createTestingPinia } from '@pinia/testing'
import { useMatchStore } from '../../pinia/store'
import { storeToRefs } from 'pinia'

vi.mock('../mapper')

describe('Rating Store', () => {
  beforeEach(() => {
    createTestingPinia({ createSpy: vi.fn })
  })

  const coachName = 'coach'
  const color = Color.rgb({ r: 0, g: 0, b: 0 })

  const fumbblMatch1: FumbblMatch = {
    id: 51,
    division: '',
    scheduler: '',
    team1: { coach: { name: '' }, score: 0 },
    team2: { coach: { name: '' }, score: 0 }
  }

  const fumbblMatch2: FumbblMatch = {
    id: 4,
    division: '',
    scheduler: '',
    team1: { coach: { name: '' }, score: 0 },
    team2: { coach: { name: '' }, score: 0 }
  }

  const fumbblMatch3: FumbblMatch = {
    id: 30,
    division: '',
    scheduler: '',
    team1: { coach: { name: '' }, score: 0 },
    team2: { coach: { name: '' }, score: 0 }
  }

  let unsortedMatches: Match[]
  function createUnsortedMatches() {
    return [
      {
        id: 51,
        category: Competitive,
        score: Score.Draw
      },
      {
        id: 4,
        category: Competitive,
        score: Score.Win
      },
      {
        id: 30,
        category: Blackbox,
        score: Score.Draw
      },
      {
        id: 12,
        category: League,
        score: Score.Loss
      },
      {
        id: 23,
        category: League,
        score: Score.Win
      }
    ]
  }

  const matches: Match[] = [
    {
      id: 4,
      category: Competitive,
      score: Score.Win
    },
    {
      id: 12,
      category: League,
      score: Score.Loss
    },
    {
      id: 23,
      category: League,
      score: Score.Win
    },
    {
      id: 30,
      category: Blackbox,
      score: Score.Draw
    },
    {
      id: 51,
      category: Competitive,
      score: Score.Draw
    }
  ]

  let store: Store

  beforeAll(() => {
    vi.mocked(randomColor).mockImplementation((): Color => {
      return color
    })
  })

  beforeEach(() => {
    store = new Store(coachName)
    unsortedMatches = createUnsortedMatches()
  })

  describe('init', () => {
    it('sorts matches and creates basic config', () => {
      store.matches = unsortedMatches
      store.categories = [Blackbox, Competitive, FFB_Test, League]
      store.init()
      expect(store.matches).toStrictEqual(matches)
      expect(store.configs.length).toBe(1)
      expect(store.configs[0]).toStrictEqual(
        new GraphConfig(color, [Blackbox, Competitive, League])
      )

      const matchStore = useMatchStore()
      const { modificationCounter } = storeToRefs(matchStore)
      expect(modificationCounter.value).toBe(1)
    })
  })

  describe('addConfig', () => {
    it('adds new default config to array', () => {
      const config: GraphConfig = new GraphConfig(color, [Blackbox, Competitive])

      store.categories = [Blackbox, Competitive, FFB_Test]

      store.addConfig()

      const matchStore = useMatchStore()
      const { modificationCounter } = storeToRefs(matchStore)
      expect(modificationCounter.value).toBe(1)

      expect(store.configs).toStrictEqual([config])
    })
  })

  describe('removeConfig', () => {
    it('removes config', () => {
      const configToRemove = new GraphConfig(new Color({ r: 0, g: 0, b: 0 }), [])
      const configToKeep = new GraphConfig(new Color({ r: 255, g: 0, b: 0 }), [])
      store.configs = [configToKeep, configToRemove]

      store.removeConfig(configToRemove)

      const matchStore = useMatchStore()
      const { modificationCounter } = storeToRefs(matchStore)
      expect(modificationCounter.value).toBe(1)

      expect(store.configs).toStrictEqual([configToKeep])
    })

    it('ignores unknown config', () => {
      const configToRemove = new GraphConfig(new Color({ r: 0, g: 0, b: 0 }), [])
      const configToKeep = new GraphConfig(new Color({ r: 255, g: 0, b: 0 }), [])
      store.configs = [configToKeep]

      store.removeConfig(configToRemove)

      expect(store.configs).toStrictEqual([configToKeep])
    })
  })

  describe('addMatch', () => {
    it('converts matches', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      vi.mocked(match).mockImplementation((fumbblMatch: FumbblMatch): Match => {
        if (fumbblMatch.id === fumbblMatch1.id) {
          return unsortedMatches[0]
        }
        if (fumbblMatch.id === fumbblMatch2.id) {
          return unsortedMatches[1]
        }
        return unsortedMatches[2]
      })

      store.addMatch(fumbblMatch1)
      store.addMatch(fumbblMatch2)
      store.addMatch(fumbblMatch3)

      expect(store.matches).toStrictEqual(unsortedMatches.slice(0, 3))
      expect(store.categories).toStrictEqual([Blackbox, Competitive])
    })
  })

  describe('graphs', () => {
    it('returns data points for all matches for default config', () => {
      store.matches = matches
      store.categories = [Blackbox, Competitive, FFB_Test, League]
      store.init()
      const graphs = store.graphs()
      expect(graphs.length).toBe(1)
      expect(graphs[0]).toStrictEqual(
        new Graph(color, [
          { index: 1, ratio: 1, title: 'coach_0' },
          { index: 2, ratio: 0.5, title: 'coach_0' },
          { index: 3, ratio: 0.6667, title: 'coach_0' },
          { index: 4, ratio: 0.625, title: 'coach_0' },
          { index: 5, ratio: 0.6, title: 'coach_0' }
        ])
      )
    })

    it('returns data points for competitive matches for blackbox config', () => {
      store.matches = matches
      store.categories = [Competitive]
      store.init()
      const graphs = store.graphs()
      expect(graphs.length).toBe(1)
      expect(graphs[0]).toStrictEqual(
        new Graph(color, [
          { index: 1, ratio: 1.0, title: 'coach_0' },
          { index: 2, ratio: 0.75, title: 'coach_0' }
        ])
      )
    })
  })
})
