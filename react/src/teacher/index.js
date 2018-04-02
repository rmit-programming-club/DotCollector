import React, {Component} from "react";
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import {Header, Image} from 'semantic-ui-react';

import DotLogo from '../../../resources/dotlogo.png';
import '../css/sass/index.sass';

import HeaderBar from './components/header'
import SessionListing from './components/sessions'


class Teacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        /* TODO make local styles into classes. */
        return (
            <div className={"teacher-background"}>
              <HeaderBar />
              <SessionListing />
            </div>
        )
    }
}
ReactDOM.render(
    <Teacher/>,
    document.getElementById('react-entry')
);
