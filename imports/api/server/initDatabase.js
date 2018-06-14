import { Teams } from "../teams.js";

if (Teams.find({}).count() == 0) {
    // instantiate database
    let teams = [
        ["Russia", "RUS", "russia", "A"],
        ["Saudi Arabia", "KSA", "saudiarabia", "A"],
        ["Egypt", "EGY", "egypt", "A"],
        ["Uruguay", "URU", "uruguay", "A"],
        ["Portugal", "POR", "portugal", "B"],
        ["Spain", "ESP", "spain", "B"],
        ["Morocco", "MAR", "morocco", "B"],
        ["Iran", "IRN", "iran", "B"],
        ["France", "FRA", "france", "C"],
        ["Australia", "AUS", "australia", "C"],
        ["Peru", "PER", "peru", "C"],
        ["Denmark", "DEN", "denmark", "C"],
        ["Argentina", "ARG", "argentina", "D"],
        ["Iceland", "ISL", "iceland", "D"],
        ["Croatia", "CRO", "croatia", "D"],
        ["Nigeria", "NGA", "nigeria", "D"],
        ["Brazil", "BRA", "brazil", "E"],
        ["Switzerland", "SUI", "switzerland", "E"],
        ["Costa Rica", "CRC", "costarica", "E"],
        ["Serbia", "SRB", "serbia", "F"],
        ["Germany", "GER", "germany", "F"],
        ["Mexico", "MEX", "mexico", "F"],
        ["Sweden", "SWE", "sweden", "F"],
        ["South Korea", "KOR", "southkorea", "F"],
        ["Belgium", "BEL", "belgium", "G"],
        ["Panama", "PAN", "panama", "G"],
        ["Tunisia", "TUN", "tunisia", "G"],
        ["England", "ENG", "england", "G"],
        ["Poland", "POL", "poland", "H"],
        ["Senegal", "SEN", "senegal", "H"],
        ["Colombia", "COL", "colombia", "H"],
        ["Japan", "JPN", "japan", "H"]
    ];
    teams.map((obj) => {
        Teams.insert({
            country: obj[0],
            abbr: obj[1],
            logoPath: "/images/countries/" + obj[2] + ".png",
            group: obj[3],
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            goalDifferential: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
        })
    });
}