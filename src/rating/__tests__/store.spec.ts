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

const coachName = 'coach'
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

describe('Rating Store', () => {
  beforeEach(() => {
    createTestingPinia({ createSpy: vi.fn })
  })

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
      store['providedMatches'].push(...unsortedMatches)
      store.categories = [Blackbox, Competitive, FFB_Test, League]
      store.init()

      const matchStore = useMatchStore()
      const { modificationCounter } = storeToRefs(matchStore)
      expect(modificationCounter.value).toBe(1)

      expect(store.matches()).toStrictEqual(matches)
      expect(store.configs.length).toBe(1)
      expect(store.configs[0]).toStrictEqual(
        new GraphConfig(
          store.coachName,
          1,
          color,
          [Blackbox, Competitive, League],
          store['providedMatches']
        )
      )
    })
  })

  describe('addConfig', () => {
    it('adds new default config to array', () => {
      store.categories = [Blackbox, Competitive, FFB_Test]

      store.addConfig()

      const matchStore = useMatchStore()
      const { modificationCounter } = storeToRefs(matchStore)
      expect(modificationCounter.value).toBe(1)

      const config: GraphConfig = new GraphConfig(
        store.coachName,
        1,
        color,
        [Blackbox, Competitive],
        []
      )
      expect(store.configs).toStrictEqual([config])
    })
  })

  describe('removeConfig', () => {
    it('removes config', () => {
      const configToRemove = new GraphConfig(
        store.coachName,
        1,
        new Color({ r: 0, g: 0, b: 0 }),
        [],
        []
      )
      const configToKeep = new GraphConfig(
        store.coachName,
        2,
        new Color({ r: 255, g: 0, b: 0 }),
        [],
        []
      )

      const matchStore = useMatchStore()
      const { modificationCounter } = storeToRefs(matchStore)
      modificationCounter.value = 0
      store.configs = [configToKeep, configToRemove]

      store.removeConfig(configToRemove)

      expect(modificationCounter.value).toBe(1)
      expect(store.configs).toStrictEqual([configToKeep])
    })

    it('ignores unknown config', () => {
      const configToRemove = new GraphConfig(
        store.coachName,
        1,
        new Color({ r: 0, g: 0, b: 0 }),
        [],
        []
      )
      const configToKeep = new GraphConfig(
        store.coachName,
        2,
        new Color({ r: 255, g: 0, b: 0 }),
        [],
        []
      )
      store.configs = [configToKeep]

      store.removeConfig(configToRemove)

      expect(store.configs).toStrictEqual([configToKeep])
    })

    it('does not recycle index', () => {
      const matchStore = useMatchStore()
      const { modificationCounter } = storeToRefs(matchStore)
      modificationCounter.value = 0
      store.addConfig()
      store.addConfig()
      store.removeConfig(store.configs[0])
      store.addConfig()

      expect(store.configs[1]['configNumber']).toBe(3)
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

      expect(store.matches()).toStrictEqual(unsortedMatches.slice(0, 3))
      expect(store.categories).toStrictEqual([Blackbox, Competitive])
    })
  })

  describe('graphs', () => {
    it('collects graphs from configs', () => {
      const config = new GraphConfig('', 0, color, [], [])
      const graph = new Graph(color, [])
      config.graph = vi.fn().mockImplementation(() => {
        return graph
      })
      store.configs.push(config)

      const graphs = store.graphs()
      expect(graphs.length).toBe(1)
      expect(graphs[0]).toBe(graph)
    })
  })
})

describe(' Graph Config', () => {
  describe('toggleCategory', () => {
    it('adds category if it is not present', () => {
      const config = new GraphConfig('coachName', 1, new Color(), [Blackbox, Competitive], [])

      config.toggleCategory(League)

      expect(config.categories).toStrictEqual([Blackbox, Competitive, League])
    })

    it('removes category if it is present', () => {
      const config = new GraphConfig('coachName', 1, new Color(), [Blackbox, Competitive], [])

      config.toggleCategory(Competitive)

      expect(config.categories).toStrictEqual([Blackbox])
    })

    it('does not remove present category if list would be empty then', () => {
      const config = new GraphConfig('coachName', 1, new Color(), [League], [])

      config.toggleCategory(League)

      expect(config.categories).toStrictEqual([League])
    })
  })
  describe('hexColor', () => {
    it('preserves and returns current color as hex', () => {
      const originalColor = '#123456'
      const config = new GraphConfig('coachName', 1, new Color(originalColor), [League], [])

      expect(config.hexColor()).toEqual(originalColor)
      expect(config.graph().color).toEqual(new Color(originalColor))
    })
  })

  describe('updateHexColor', () => {
    it('updates color', () => {
      const originalColor = '#123456'
      const newColor = '#654321'
      const config = new GraphConfig('coachName', 1, new Color(originalColor), [League], [])

      config.updateHexColor(newColor)

      expect(config.graph().color).toEqual(new Color(newColor))
    })
  })

  describe('graph', () => {
    it('returns a graph with data points for all matches', () => {
      const index = 1
      const color = new Color('#654321')
      const categories = [Blackbox, Competitive, FFB_Test, League]
      const config = new GraphConfig(coachName, index, color, categories, matches)

      const graph = config.graph()
      expect(graph).toStrictEqual(
        new Graph(color, [
          { index: 1, ratio: 1, title: 'coach #1' },
          { index: 2, ratio: 0.5, title: 'coach #1' },
          { index: 3, ratio: 0.6667, title: 'coach #1' },
          { index: 4, ratio: 0.625, title: 'coach #1' },
          { index: 5, ratio: 0.6, title: 'coach #1' }
        ])
      )
    })

    it('returns data points for competitive matches', () => {
      const index = 1
      const color = new Color('#654321')
      const categories = [Competitive]
      const config = new GraphConfig(coachName, index, color, categories, matches)

      const graph = config.graph()
      expect(graph).toStrictEqual(
        new Graph(color, [
          { index: 1, ratio: 1.0, title: 'coach #1' },
          { index: 2, ratio: 0.75, title: 'coach #1' }
        ])
      )
    })
  })
})
