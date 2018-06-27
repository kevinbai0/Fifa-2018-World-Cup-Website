import { Meteor } from 'meteor/meteor';
import "/imports/api/teams.js";
import "/imports/api/server/initDatabase.js";
import Twit from 'twit';
import { Games, Teams } from '../../api/teams';

var client = new Twit({ // keys goes here
  consumer_key: "", 
  consumer_secret: "",
  access_token: "",
  access_token_secret: ""
});

Meteor.startup(() => {
  // code to run on server at startup
  //updateGamesDatabase();
  // add egypt vs uruguay since free version of api cannot find them (7 days maximum)
  // add Morocco vs iran
  Games.update({home: "Egypt", away: "Uruguay"}, {$set: {
    homeScore: 0,
    awayScore: 1
  }});
  Games.update({home: "Morocco", away: "Iran"}, {$set: {
    homeScore: 0,
    awayScore: 1
  }});
  // FIFA world cup inputted wrong scores
  Games.update({home: "Costa Rica", away: "Serbia"}, {$set: {
    homeScore: 0,
    awayScore: 1
  }});

  Meteor.methods({
    updateFromTwiter(completion) {
      console.log("Begin Update");
      updateGamesDatabase(() => {
        updateStandings(function() {
          completion;
        });
      });
    }
  });
  Meteor.publish('updateFromTwitter', function() {
    Meteor.call("updateFromTwiter");
    return Games.find();
  });
});

let updateStandingsSync = Meteor.bindEnvironment(updateStandings);
function updateStandings(completion) {
  let games = Games.find({}).fetch();

  // reset all the team standings
  Teams.update({}, {$set: {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      goalDifferential: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
  }}, {multi: true});

  games.forEach((game) => {
    if (game.homeScore != -1 && game.awayScore != -1) {
      // update the game based on the score
      let homeTeam = Teams.findOne({country: game.home});
      let awayTeam = Teams.findOne({country: game.away});
      var homePoints = game.homeScore > game.awayScore ? 3 : game.homeScore < game.awayScore ? 0 : 1;

      Teams.update({_id: homeTeam._id}, {$set: {
        gamesPlayed: homeTeam.gamesPlayed + 1,
        wins: homePoints == 3 ? homeTeam.wins + 1 : homeTeam.wins,
        losses: homePoints == 0 ? homeTeam.losses + 1: homeTeam.losses,
        draws: homePoints == 1 ? homeTeam.draws + 1 : homeTeam.draws,
        goalDifferential: homeTeam.goalDifferential + game.homeScore - game.awayScore,
        goalsFor: homeTeam.goalsFor + game.homeScore,
        goalsAgainst: homeTeam.goalsAgainst - game.awayScore,
        points: homeTeam.points + homePoints
      }});
      Teams.update({_id: awayTeam._id}, {$set: {
        gamesPlayed: awayTeam.gamesPlayed + 1,
        wins: homePoints == 0 ? awayTeam.wins + 1 : awayTeam.wins,
        losses: homePoints == 3 ? awayTeam.losses + 1: awayTeam.losses,
        draws: homePoints == 1 ? awayTeam.draws + 1 : awayTeam.draws,
        goalDifferential: awayTeam.goalDifferential + game.awayScore - game.homeScore,
        goalsFor: awayTeam.goalsFor + game.awayScore,
        goalsAgainst: awayTeam.goalsAgainst - game.homeScore,
        points: awayTeam.points + (homePoints == 1 ? 1 : homePoints == 3 ? 0 : 3)
      }});
    }
    completion();
  })
}

let updateDatabaseForRequestSync = Meteor.bindEnvironment(updateDatabaseForRequest);
function updateDatabaseForRequest(abbreviations, i, completion, scores) {
  if (i < abbreviations.length) {
    client.get('search/tweets', { q: '#' + abbreviations[i] + '%from:FIFAWorldCup', count: 100 }, function(err, data, response) {
      let statuses = data['statuses'];
      if (statuses != undefined) {
        // filter tweets
        let filteredTweets = statuses.filter((status) => {
          let text = status['text'];
          return text.match(/([0-9])-[0-9]/g) != null
        });
        // update scores
        scores = updateScoresFromTweets(scores, filteredTweets);

        // update database for new scores
        for (score in scores) {
          let homeAbbr = score.substring(1,4);
          let awayAbbr = score.substring(4,7);
          //match with the teams
          updateGameSync(scores, homeAbbr, awayAbbr);
        }
        // after each sync request update the standings

        updateDatabaseForRequestSync(abbreviations, i+1, completion, scores);
      }
      else {
        console.log(data);
      }
    });
  }
  else {
    completion(scores);
  }
}

function updateGamesDatabase(completion) {
  let games = Games.find({}).fetch();
  let teams = Teams.find({}).fetch();
  // get abbreviations (eg: ESPPOR from the games)
  // get abbreviations from teams
  let teamAbbreviations = teams.map((team) => { return team.abbr });
  let abbreviations = getAbbreviationsFromGames(games);
  for(abbreviation of teamAbbreviations) {
    abbreviations.push(abbreviation);
  }
  // for each abbreviation find tweets with the hashtag and fifa world cup

  updateDatabaseForRequestSync(abbreviations, 0, () => {
    // now use the scores to update the games database
    console.log("Finished Updating");
    completion();
  }, {});
}


let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getDateFromTwitterCreatedAtString(string) {
  let components = string.split(" ");

  let month = parseInt(months.indexOf(components[1]));
  let date = parseInt(components[2]);
  let timeComponents = components[3].split(":");
  let hour = parseInt(timeComponents[0]);
  let minute = parseInt(timeComponents[1]);
  let second = parseInt(timeComponents[2]);

  return new Date(2018, month, date, hour, minute, second);
}

let updateGameSync = Meteor.bindEnvironment(updateGameAsync);
function updateGameAsync(scores, homeAbbr, awayAbbr) {
  let homeTeam = Teams.findOne({abbr: homeAbbr });
  let awayTeam = Teams.findOne({abbr: awayAbbr });
  let game = Games.findOne({home: homeTeam.country, away: awayTeam.country });
  if (game != undefined) {
    let home = parseInt(scores["#"+homeAbbr + awayAbbr].score.substring(0,1));
    let away = parseInt(scores["#"+homeAbbr + awayAbbr].score.substring(2,3));
    //console.log(game.home + ": " + game.homeScore + ", " + game.away + ": " + game.awayScore);
    Games.update(game._id, { $set: { homeScore: home, awayScore: away } });
  }
}

function updateScoresFromTweets(scores, tweets) {
  var updatedScores = scores; // in format of "abbr": {"score": "1-2", "tweet": tweet}
  for (tweet of tweets) {
    // list all game abbreviations in the tweet filter with /#([A-Z]){6}/g to filter #AUFLJA (6 cap letters)
    let gameAbbreviationsInTweet = tweet.text.match(/#[A-Z]{6}/g);
    let homeAbbreviationsInTweet = tweet.text.match(/ #[A-Z]{3} /g);
    let scoresInTweet = tweet.text.match(/[0-9]-[0-9]/g);
    // get the tweet time and compare it to the 

    if (gameAbbreviationsInTweet != null && scoresInTweet != null) {
      let length = gameAbbreviationsInTweet.length < scoresInTweet.length ? gameAbbreviationsInTweet.length : scoresInTweet.length;
      for (var i = 0; i < length; i++) {
        // match the first abbr with the first score, second abbr with second ...
        let abbr = gameAbbreviationsInTweet[i];
        let currentScore = scoresInTweet[i];
        if (updatedScores.hasOwnProperty(abbr)) {
          // check the property tweet and the current tweet time
          let oldScoreDate = getDateFromTwitterCreatedAtString(updatedScores[abbr].tweet['created_at']);
          let newScoreDate = getDateFromTwitterCreatedAtString(tweet['created_at']);
          if (oldScoreDate - newScoreDate < 0) {
            updatedScores[abbr] = {"score": currentScore, "tweet": tweet};
            console.log(currentScore + " " + abbr);
          }
        }
        else {
          updatedScores[abbr] = {"score": currentScore, "tweet": tweet};
          console.log(currentScore + " " + abbr);
        }
      }
    }
  }
  return updatedScores;
}

function getAbbreviationsFromGames(games) {
  return games.reduce(function (filtered, game) {
    let homeTeam = Teams.findOne({country: game.home});
    let awayTeam = Teams.findOne({country: game.away});
    if (homeTeam != undefined && awayTeam != undefined) {
      filtered.push(homeTeam.abbr + awayTeam.abbr);
    }
    return filtered;
  }, []);
}

