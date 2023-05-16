const BASE_URL = "https://fumbbl.com/api/";

const MATCH_API = BASE_URL + "match/list/";

const COACH_SEARCH_API = BASE_URL + "coach/search/";

export async function load(
  coachName: string, countCallback: (count: number) => void,
  matchesCallback: (data: FumbblMatch[]) => void, errorCallback: (msg: string) => void,
  coachCallback: (msg: string) => void): Promise<void> {

  countCallback(0);
  errorCallback("");

  if (coachName == null || coachName.trim().length == 0) {
    errorCallback("No coach name given");
    return;
  }

  const searchResponse = await fetch(COACH_SEARCH_API + coachName);

  const searchResult: { name: string }[] = await searchResponse.json();

  if (searchResult.filter(value => value.name.toLowerCase() === coachName.toLowerCase()).length != 1) {
    errorCallback("Unknown coach '" + coachName + "'");
    return;
  }

  coachCallback(coachName);

  let lastResponse: FumbblMatch[] = await (await window.fetch(MATCH_API + coachName)).json();

  const response: FumbblMatch[] = lastResponse;

  let lastId: number = response[response.length - 1].id;

  while (lastResponse.length > 1) {
    lastResponse = (await (await window.fetch(MATCH_API + coachName + "/" + lastId)).json());
    for (const element of lastResponse) {
      if (element.id != lastId) {
        response.push(element);
        lastId = element.id;
        countCallback(response.length);
      }
    }
  }


  matchesCallback(response);
}