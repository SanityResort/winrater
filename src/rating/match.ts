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
  Blackbox = "Blackbox",
  Competitive = "Competitive",
  League = "League",
  Ranked = "Ranked",
  Unranked = "Unranked",
  Legacy_Blackbox = "Blackbox 2016",
  Academy = "Academy",
  Faction = "Faction",
  Stunty_Leeg = "Stunty Leeg",
  DivX = "DivX",
  FFB_Test = "FFB Test",
  Fantasy_Football = "Legacy Test",
  LRB4 = "LRB4",
  Transfer = "Transfer Division",
  Transfer2 = "Transfer Division 2"
}