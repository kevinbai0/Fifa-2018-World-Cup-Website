import React, {Component} from 'react';
import GroupTable from "./groupTable.js";
import { Teams } from "../api/teams.js";
import { withTracker } from 'meteor/react-meteor-data';
import "../stylesheets/standings.css";

class Standings extends Component {
    render() {
        var groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
        
        var groupTables = [];
        for (var i = 0; i < 8; i++) {
            groupTables.push([]);
            for (var j = i * 4; j < i*4 + 4; j++) {
                if (this.props.teams[j] != undefined) {
                    groupTables[i].push(this.props.teams[j]);
                }
            }
        }
        console.log(groupTables);
        return (
            <div className="standings">
                { 
                    groupTables.map((group, i) => {
                        return <GroupTable group={groups[i]} key={i} teams={group.map((team) => {
                            return team;
                        })}/>;
                    })
                }
            </div>
        );
    }
}


export default withTracker(() => {
    Meteor.subscribe('teams');
    return {
      teams: Teams.find({}).fetch()
    };
  })(Standings);