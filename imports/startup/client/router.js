import React from "react";
import { render } from 'react-dom';
import { BrowserRouter, Route, IndexRoute, browserHistory } from "react-router-dom";
import Standings from "../../ui/components/standings";
import Schedules from "../../ui/components/schedules";

import Navbar from "../../ui/components/navbar";
import LatestUpdates from "../../ui/components/latestUpdates";

Meteor.startup(() => {
    render(
        <BrowserRouter history={browserHistory}>
            <div>
                <Navbar items={
                        [
                            { link: "/", title: "Latest Updates"}, 
                            { link: "/standings", title: "Standings"}, 
                            { link: "/schedules", title: "Schedules"}, 
                        ]
                    }
                />
                <Route path="/" component={UpdateTwitter}/>
                <Route exact path="/" component={LatestUpdates}/>
                <Route path="/standings" component={Standings}/>
                <Route path="/schedules" component={Schedules}/>
            </div>
        </BrowserRouter>,
        document.getElementById('render-target')
    );
});

class UpdateTwitter extends React.Component {
    constructor(props) {
        super(props);
        console.log("init");
        this.state = { databaseLoaded: false};
    }
    componentDidMount() {
        Meteor.subscribe("updateFromTwitter");
        Meteor.call("updateFromTwitter", () => {
            console.log("Loaded");
            setTimeout(() => {
                this.setState({databaseLoaded: true});
            },10000)
        });
    }
    render() {
        if (!this.state.databaseLoaded) {
            return (
            <div className="databaseLoading">
                <p>Database is currently loading, data may not up to date</p>
                <div className="loader-symbol"></div>
            </div>)
        }
        else {
            return(<div/>);
        }
    }

}