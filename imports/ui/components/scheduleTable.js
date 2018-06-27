import React from "react";

export default class ScheduleTable extends React.Component {
    constructor(props) {
        super(props);
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    }
    render() {
        let month = this.props.date.getMonth();
        let day = this.props.date.getDay();
        let date = this.props.date.getDate();
        let year = this.props.date.getFullYear();

        return (
            <div className="schedule-table-body">
                <h1>
                    {this.days[day] }, {this.months[month]} {date}, {year}
                </h1>
                <div className="schedule-row schedule-title-row">
                    <span className="row-1">Time</span>
                    <span className="row-2-3">Home</span>
                    <span className="row-4-5">Away</span>
                    <span className="row-6">Score</span>
                    <span className="row-7">Stage</span>
                    <span className="row-8">Location</span>
                </div>
                {
                    this.props.games.map((game, i) => {
                        
                        let homeTeam = this.props.teams.find((team) => {
                            return team.country == game.home
                        });
                        let awayTeam = this.props.teams.find((team) => {
                            return team.country == game.away;
                        });

                        let pmTime = game.date.getUTCHours() - 4;
                        var pmString = "AM"

                        if (pmTime > 12) {
                            pmTime -= 12;
                            pmString = "PM"
                        }

                        if (homeTeam != undefined && awayTeam != undefined) {
                            return (
                                <div key={i} className="schedule-row">
                                    <span className="row-1">{pmTime + ":00 " + pmString}</span>
                                    <span className="row-2 team-span-img"><img src={homeTeam.logoPath}/></span>
                                    <span className="row-3 team-span-name">{game.home}</span>
                                    <span className="row-4 team-span-img"><img src={awayTeam.logoPath}/></span>
                                    <span className="row-5 team-span-name">{game.away}</span>
                                    <span className="row-6 score-label">{game.homeScore == -1 ? "" : game.homeScore} - {game.awayScore == -1 ? "" : game.awayScore}</span>
                                    <span className="row-7">{game.matchType == "Group" ? game.matchType : ""} {game.matchSubtype}</span>
                                    <span className="row-8">{game.location}</span>
                                </div>
                            );
                        }
                        else {
                            return (
                                <div key={i} className="schedule-row">
                                    <span className="row-1">{game.date.getUTCHours()}:00</span>
                                    <span className="row-2-3">{game.home}</span>
                                    <span className="row-4-5">{game.away}</span>
                                    <span className="row-6">{game.homeScore == -1 ? "-" : game.homeScore} : {game.awayScore == -1 ? "-" : game.awayScore}</span>
                                    <span className="row-7">{game.matchType == "Group" ? game.matchType : ""} {game.matchSubtype}</span>
                                    <span className="row-8">{game.location}</span>
                                </div>
                            );
                        }
                        
                    })
                }
            </div>
        );
    }
}