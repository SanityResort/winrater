interface Match {
  score: Score;
  id: number;
  time: Date;
  category: Category
}

enum Score {
  Win = 1,
  Draw = 0.5,
  Loss = 0
}

enum Category {
  Blackbox = "Competitive_Blackbox",
  Competitive = "Competitive_Gamefinder",
  League = "League",
  Ranked = "Ranked",
  Legacy_Blackbox = "Blackbox",
  Open = "Open",
  Faction = "Faction",
  Stunty_Leeg = "Stunty Leeg",
  DivX = "DivX",
  Test = "Test"
}