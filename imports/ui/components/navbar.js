import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../../stylesheets/nav.css";

export default class Navbar extends Component {
    render() {
        return (
            <nav className="nav-container">
                <h1 className="nav-title">2018 Fifa World Cup™</h1>
                <div className="nav-list-container">
                    {
                        this.props.items.map(function(item, i) {
                            return (
                                <span className="nav-list-item" key={i}>
                                    <Link to={item.link}> {item.title} </Link>
                                </span>
                            );
                        }, this)
                    }
                </div>
            </nav>
        );
    }
}