import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Teams = new Mongo.Collection("teams");

Teams.deny({
    insert() { return true },
    update() { return true },
    remove() { return true}
});


if (Meteor.isServer) {
    Meteor.publish('teams', function() {
        return Teams.find();
    });
}


/*const teamsSchema = new SimpleSchema({
    country: {type: String},
    abbr: {type: String},
    logoPath: {type: String},
    group: {type: String},
    gamesPlayed: {type: Number},
    wins: {type: Number},
    losses: {type: Number},
    draws: {type: Number},
    goalDifferential: {type: Number},
    goalsFor: {type: Number},
    goalsAgainst: {type: Number},
    points: {type: Number}
});

Teams.attachSchema(teamsSchema);*/

/* 
Teams.insert({
    country: "Russia",
    abbr: "RUS",
    logoPath: "/images/countries/russia.png",
    group: "A",
    gamesPlayed: 0,
    wins: {type: Number},
    losses: 0,
    draws: 0,
    goalDifferential: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
})
*/