import React, {Component} from 'react';
import "../stylesheets/standings.css";

export default class GroupTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let teams = this.props.teams;
        return(
            <div className="group-table-container">
                <h1> Group {this.props.group} </h1>
                <table className="group-table">
                    <tbody>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>MP</th>
                            <th>W</th>
                            <th>L</th>
                            <th>D</th>
                            <th>GD</th>
                            <th>PTS</th>
                        </tr>
                        {
                            teams.map((team, i) => {
                                return(
                                    <tr key={i}>
                                        <td className="country-logo-cell"><img className="group-table-image" src={team.logoPath} /></td>
                                        <td className="country-abbr-cell">{team.abbr}</td>
                                        <td>{team.gamesPlayed}</td>
                                        <td>{team.wins}</td>
                                        <td>{team.losses}</td>
                                        <td>{team.draws}</td>
                                        <td>{team.goalDifferential}</td>
                                        <td>{team.points}</td>
                                    </tr>);
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}