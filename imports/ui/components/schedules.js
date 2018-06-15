import React, {Component} from 'react';
import { Games } from "../../api/teams.js";
import { withTracker } from 'meteor/react-meteor-data';
import "../../stylesheets/schedules.css";

class Schedules extends Component {
    render() {
        return (
            this.props.games.map((game, i) => {
                return <div key={i}> {game.home} vs {game.away} </div>
            })
        );
    }
}


export default withTracker(() => {
    Meteor.subscribe('games');
    return {
      games: Games.find({}).fetch()
    };
  })(Schedules);