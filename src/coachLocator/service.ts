import type { Ref } from 'vue'
import type { Store } from '@/rating/store'

const BASE_URL = 'https://fumbbl.com/api/'

const MATCH_API = BASE_URL + 'match/list/'

const COACH_SEARCH_API = BASE_URL + 'coach/search/'

export async function load(
  coachName: string,
  store: Store,
  errorMessage: Ref<string>
): Promise<void> {
  errorMessage.value = ''

  if (coachName == null || coachName.trim().length == 0) {
    errorMessage.value = 'No coach name given'
    return
  }

  const searchResponse: Response = await fetch(COACH_SEARCH_API + coachName)

  const searchResult: { name: string }[] = await searchResponse.json()

  if (
    searchResult.filter((value) => value.name.toLowerCase() === coachName.toLowerCase()).length != 1
  ) {
    errorMessage.value = "Unknown coach '" + coachName + "'"
    return
  }

  let lastResponse: FumbblMatch[]

  let lastId: number = 0

  do {
    let url: string = MATCH_API + coachName
    if (lastId != 0) {
      url = url + '/' + lastId
    }
    lastResponse = await (await window.fetch(url)).json()
    lastId = lastResponse[lastResponse.length - 1].id
    for (const element of lastResponse) {
      if (element.id != lastId) {
        store.fumbblMatches.value.push(element)
        lastId = element.id
      }
    }
  } while (lastResponse.length > 1)

  store.init()
}
