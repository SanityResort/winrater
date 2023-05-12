const BASE_URL = "https://fumbbl.com/api/match/list/";

export async function load(coachName: string): Promise<{ id: number }[]> {

  let lastResponse: { id: number }[] = await (await window.fetch(BASE_URL + coachName)).json();

  const response: { id: number }[] = lastResponse;

  let lastId: number = response[response.length - 1].id;

  while (lastResponse.length > 1) {
    lastResponse = (await (await window.fetch(BASE_URL + coachName + "/" + lastId)).json());
    for (const element of lastResponse) {
      if (element.id != lastId) {
        response.push(element)
        lastId = element.id
      }
    }
  }


  return Promise.resolve(response);
}