import type { Mock } from 'vitest'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { load } from '../service'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { Store } from '../../rating/store'

describe('coach lookup service', () => {
  let fetchMock: Mock
  let initMock: Mock

  let errorRef: Ref<string>
  const coachName = 'name'
  let store: Store

  beforeAll(() => {
    fetchMock = vi.fn().mockImplementation(window.fetch)
    window.fetch = fetchMock
    initMock = vi.fn()
  })

  beforeEach(() => {
    errorRef = ref('')
    store = new Store(coachName)
    store.init = initMock

    fetchMock.mockImplementation((url: string) => {
      let response: { id: number; name?: string }[] = []
      if (url.indexOf('search') > -1) {
        response = [{ id: 1, name: coachName }]
      } else if (url.endsWith('/' + coachName)) {
        response = [{ id: 3 }, { id: 2 }]
      } else if (url.endsWith('/' + coachName + '/2')) {
        response = [{ id: 2 }, { id: 1 }, { id: 0 }]
      } else if (url.endsWith('/' + coachName + '/0')) {
        response = [{ id: 0 }]
      }

      return new Response(JSON.stringify(response))
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls fumbbl api', async () => {
    await load(store, errorRef)

    const expected: { id: number }[] = [{ id: 3 }, { id: 2 }, { id: 1 }, { id: 0 }]

    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/coach/search/name')
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/match/list/name')
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/match/list/name/2')
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/match/list/name/0')

    expect(initMock).toHaveBeenCalledTimes(1)

    expect(store.fumbblMatches.value).toStrictEqual(expected)
    expect(errorRef.value).toBe('')
  })

  it('aborts for unknown coach', async () => {
    store.coachName = 'foo'
    await load(store, errorRef)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/coach/search/foo')

    expect(initMock).toHaveBeenCalledTimes(0)

    expect(store.matches).toStrictEqual([])

    expect(errorRef.value).toBe("Unknown coach 'foo'")
  })

  it.each([
    { input: null as unknown as string, name: 'null' },
    { input: ' ', name: 'empty' }
  ])('aborts for $name coach', async (param) => {
    store.coachName = param.input

    await load(store, errorRef)

    expect(fetchMock).toHaveBeenCalledTimes(0)

    expect(initMock).toHaveBeenCalledTimes(0)

    expect(store.matches).toStrictEqual([])

    expect(errorRef.value).toBe('No coach name given')
  })
})
