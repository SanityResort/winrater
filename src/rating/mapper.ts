import { Category } from "./match";

export function category(input: FumbblMatch): Category {
    switch (input.division) {
        case "Competitive" :
            if (input.scheduler === "Blackbox") {
                return Category.Blackbox;
            }
            return Category.Competitive;
        case "Blackbox":
            return Category.Legacy_Blackbox;
        case "League":
            return Category.League;
        case "Ranked":
            return Category.Ranked;
        case "Unranked":
            return Category.Unranked;
        case "Stunty Leeg":
            return Category.Stunty_Leeg;
        case "DivX Legacy":
            return Category.DivX;
        case "Academy":
            return Category.Academy;
        case "Faction":
            return Category.Faction;
        case "FFB Test":
            return Category.FFB_Test;
        case "Fantasy Football":
            return Category.Fantasy_Football;
        case "LRB4":
            return Category.LRB4;
        case "Transfer Division":
            return Category.Transfer;
        case "Transfer Division 2":
            return Category.Transfer2;
        case "Ladder":
            return Category.Ladder;
        default:
            return Category.Unknown
    }


}