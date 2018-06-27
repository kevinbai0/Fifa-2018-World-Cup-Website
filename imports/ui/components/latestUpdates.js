import React from 'react';
import "../../stylesheets/latestUpdates.css";
import {TwitterTimelineEmbed} from "react-twitter-embed";
import {Meteor} from "meteor/meteor";


export default class LatestUpdates extends React.Component {
    render() {

        return (
            <div className="twitter-embed">
                <TwitterTimelineEmbed
                sourceType="profile"
                screenName="FIFAWorldCup"
                />
            </div>
        );
    }
}