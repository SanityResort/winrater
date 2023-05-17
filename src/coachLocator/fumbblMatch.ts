// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FumbblMatch {
  id: number
  division: string
  scheduler: string
  team1: Team
  team2: Team
}

interface Team {
  coach: Coach
  score: number
}

interface Coach {
  name: string
}
