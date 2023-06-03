import type { Mock } from 'vitest'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { load } from '../service'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { Store } from '../../rating/store'
import { createTestingPinia } from '@pinia/testing'

describe.each([
  { errorMessage: '', suffix: 'when no error message is present' },
  { errorMessage: 'some error', suffix: 'and resets error messages' }
])('coach lookup service', (parentContext) => {
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
    createTestingPinia({ createSpy: vi.fn })

    errorRef = ref(parentContext.errorMessage)
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

  it.each([{ suffix: parentContext.suffix }])('calls fumbbl api $suffix', async () => {
    const result: boolean = await load(store, errorRef)

    const expected: { id: number }[] = [{ id: 3 }, { id: 2 }, { id: 1 }, { id: 0 }]

    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/coach/search/name')
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/match/list/name')
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/match/list/name/2')
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/match/list/name/0')

    expect(initMock).toHaveBeenCalledTimes(1)

    expect(store.fumbblMatches.value).toStrictEqual(expected)
    expect(errorRef.value).toBe('')

    expect(result).toBeTruthy()
  })

  it.each([{ suffix: parentContext.suffix }])('aborts for unknown coach $suffix', async () => {
    store.coachName = 'foo'
    const result: boolean = await load(store, errorRef)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('https://fumbbl.com/api/coach/search/foo')

    expect(initMock).toHaveBeenCalledTimes(0)

    expect(store.matches).toStrictEqual([])
    expect(errorRef.value).toBe("Unknown coach 'foo'")

    expect(result).toBeFalsy()
  })

  it.each([
    { input: null as unknown as string, name: 'null', suffix: parentContext.suffix },
    { input: ' ', name: 'empty', suffix: parentContext.suffix }
  ])('aborts for $name coach $suffix', async (param) => {
    store.coachName = param.input

    const result: boolean = await load(store, errorRef)

    expect(fetchMock).toHaveBeenCalledTimes(0)
    expect(initMock).toHaveBeenCalledTimes(0)

    expect(store.matches).toStrictEqual([])
    expect(errorRef.value).toBe('No coach name given')

    expect(result).toBeFalsy()
  })
})
