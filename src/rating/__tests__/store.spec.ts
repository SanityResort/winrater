import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Graph, GraphConfig, Store } from '../store'
import type { Match } from '../match'
import { Category, Score } from '../match'
import Color from 'color'
import { match } from '../mapper'

vi.mock('../mapper')

describe('Rating Store', () => {
  const coachName = 'coach'
  const color = Color.rgb({ r: 0, g: 0, b: 0 })

  const fumbblMatches: FumbblMatch[] = [
    {
      id: 51,
      division: '',
      scheduler: '',
      team1: { coach: { name: '' }, score: 0 },
      team2: { coach: { name: '' }, score: 0 }
    },
    {
      id: 4,
      division: '',
      scheduler: '',
      team1: { coach: { name: '' }, score: 0 },
      team2: { coach: { name: '' }, score: 0 }
    },
    {
      id: 12,
      division: '',
      scheduler: '',
      team1: { coach: { name: '' }, score: 0 },
      team2: { coach: { name: '' }, score: 0 }
    },
    {
      id: 30,
      division: '',
      scheduler: '',
      team1: { coach: { name: '' }, score: 0 },
      team2: { coach: { name: '' }, score: 0 }
    },
    {
      id: 23,
      division: '',
      scheduler: '',
      team1: { coach: { name: '' }, score: 0 },
      team2: { coach: { name: '' }, score: 0 }
    }
  ]
  const unsortedMatches: Match[] = [
    {
      id: 51,
      category: Category.Blackbox,
      score: Score.Draw
    },
    {
      id: 4,
      category: Category.Competitive,
      score: Score.Win
    },
    {
      id: 12,
      category: Category.League,
      score: Score.Loss
    },
    {
      id: 30,
      category: Category.Blackbox,
      score: Score.Draw
    },
    {
      id: 23,
      category: Category.League,
      score: Score.Win
    }
  ]
  const matches: Match[] = [
    {
      id: 4,
      category: Category.Competitive,
      score: Score.Win
    },
    {
      id: 12,
      category: Category.League,
      score: Score.Loss
    },
    {
      id: 23,
      category: Category.League,
      score: Score.Win
    },
    {
      id: 30,
      category: Category.Blackbox,
      score: Score.Draw
    },
    {
      id: 51,
      category: Category.Blackbox,
      score: Score.Draw
    }
  ]

  let store: Store

  beforeEach(() => {
    store = new Store(coachName)
    store.fumbblMatches.value = fumbblMatches
  })

  describe('configs', () => {
    it('is initialized with default config', () => {
      expect(store.configs.length).toBe(1)
      expect(store.configs[0]).toStrictEqual(new GraphConfig(color, []))
    })
  })

  describe('init', () => {
    it('creates and maps matches', () => {
      vi.mocked(match).mockImplementation((fumbblMatch: FumbblMatch): Match => {
        return unsortedMatches[fumbblMatches.findIndex((match) => match.id === fumbblMatch.id)]
      })
      store.fumbblMatches.value = fumbblMatches
      store.init()
      expect(store.matches).toStrictEqual(matches)
    })
  })

  describe('graphs', () => {
    it('returns data points for all matches for default config', () => {
      store.matches = matches
      const graphs = store.graphs()
      expect(graphs.length).toBe(1)
      expect(graphs[0]).toStrictEqual(
        new Graph(color, [
          { index: 0, ratio: 1 },
          { index: 1, ratio: 0.5 },
          { index: 2, ratio: 0.6667 },
          { index: 3, ratio: 0.625 },
          { index: 4, ratio: 0.6 }
        ])
      )
    })
  })
})
