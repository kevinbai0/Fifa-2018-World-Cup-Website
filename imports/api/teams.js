import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Teams = new Mongo.Collection("teams");
export const Games = new Mongo.Collection("games");

Teams.deny({
    insert() { return true },
    update() { return true },
    remove() { return true}
});

Games.deny({
    insert() { return true },
    update() { return true },
    remove() { return true}
})


if (Meteor.isServer) {
    Meteor.publish('teams', function() {
        return Teams.find();
    });

    Meteor.publish('games', function() {
        return Games.find();
    });
}