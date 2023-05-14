import { Category } from "./match";

export function category(input: FumbblMatch): Category {
    switch (input.division) {
        case "Competitive" :
            if (input.scheduler === "Blackbox") {
                return Category.Blackbox;
            }
            return Category.Competitive;
        default:
            return Category.Unknown
    }


}