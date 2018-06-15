import React from "react";
import { render } from 'react-dom';
import { BrowserRouter, Route, IndexRoute, browserHistory } from "react-router-dom";
import Standings from "../../ui/components/standings";
import Schedules from "../../ui/components/schedules";

import Navbar from "../../ui/components/navbar";

Meteor.startup(() => {
    render(
        <BrowserRouter history={browserHistory}>
            <div>
                <Navbar items={
                        [
                            { link: "/", title: "Latest Updates"}, 
                            { link: "/standings", title: "Standings"}, 
                            { link: "/schedules", title: "Schedules"}, 
                            { link: "/teams", title: "Teams"},
                            { link: "/players", title: "Players"}
                        ]
                    }
                />
                <Route path="/standings" component={Standings}/>
                <Route path="/schedules" component={Schedules}/>
            </div>
        </BrowserRouter>,
        document.getElementById('render-target')
    );
});