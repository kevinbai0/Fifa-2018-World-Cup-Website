import React, {Component} from 'react';
import { Games, Teams } from "../../api/teams.js";
import { withTracker } from 'meteor/react-meteor-data';
import "../../stylesheets/schedules.css";
import ScheduleTable from './scheduleTable';

class Schedules extends Component {
    render() {
        let gamesByDate = this.sortGamesByDate(this.props.games);
        return (
            <div className="schedule-table">
                {   
                    gamesByDate.map((games, i) => {
                        return <ScheduleTable teams={this.props.teams} games={games} date={games[0].date} key={i}/>
                    })
                }
            </div>
            
        );
    }

    sortGamesByDate(games) {
        // get start indice
        var prevStartDate = "";
        let startIndices = [];
        for (var i = 0; i < games.length; i++) {
            if (i == 0) startIndices.push(i);
            else if (!sameDate(games[i].date, games[i-1].date)){
                startIndices.push(i);
            }
        }
        function sameDate(date1, date2) {
            return date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
        }

        var current = 0;
        let sortedGames = [];
        for (var i = 0; i < startIndices.length; i++) {
            sortedGames.push([]);
            let start = startIndices[i];
            let end = i + 1 < startIndices.length ? startIndices[i+1] - 1 : games.length - 1;
            for (var j = start; j <= end; j++) {
                sortedGames[i].push(games[j]);
            }
        }
        return sortedGames;
    }

    
}


export default withTracker(() => {
    Meteor.subscribe('games');
    Meteor.subscribe('teams');
    return {
      teams: Teams.find({}).fetch(),
      games: Games.find({}).fetch()
    };
  })(Schedules);