interface FumbblMatch {
  id: number,
  division: string,
  scheduler: string,
  date: string,
  time: string,
  team1: Team,
  team2: Team
}

interface Team {
  coach: Coach,
  score: number
}

interface Coach {
  name: string
}