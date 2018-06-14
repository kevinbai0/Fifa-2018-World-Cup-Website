import React, { Component } from 'react';
import "../stylesheets/nav.css";

export default class Navbar extends Component {
    navItemClicked = (e) => {
        console.log(e.target);
    }
    render() {
        return (
            <nav className="nav-container">
                <h1 className="nav-title">2018 Fifa World Cup™</h1>
                <div className="nav-list-container">
                    {
                        this.props.items.map(function(item, i) {
                            return (
                                <span className="nav-list-item" key={i} onClick={(e) => this.navItemClicked(e)}>{item}</span>
                            );
                        }, this)
                    }
                </div>
            </nav>
        );
    }
}