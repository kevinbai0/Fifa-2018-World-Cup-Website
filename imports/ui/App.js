import React, { Component } from 'react';
import Navbar from "./navbar.js";
import Standings from "./standings.js";


export default class App extends Component {
    constructor(props) {
        super(props);
        // get countries from json list
    }
    render() {
        return (
            <div>
                <Navbar items={["Latest Updates", "Standings", "Schedules", "Teams", "Players"]} />
                <Standings />
            </div>
        );
    }
}