const BASE_URL = "https://fumbbl.com/api/match/list/"

export async function load(coachName: string): Promise<[]> {
  return (await window.fetch(BASE_URL + coachName)).json()
}