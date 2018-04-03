import React, {Component} from "react";
import ReactDOM from 'react-dom';

import Feedback from './containers/feedback'

import 'semantic-ui-css/semantic.min.css';
import '../css/sass/index.sass';
import {Header, Image} from 'semantic-ui-react';

import DotLogo from '../../html/resources/dotlogo.png';


class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        /* TODO make local styles into classes. */
        /*return (
            <div className={"trial"}>
                <Image src={DotLogo} style={{display: "block", margin: "0 auto"}}/>
                <Header size="huge" className={"primary-text"} style={{"font-size": "4em"}}>Dot Collector</Header>
            </div>
        )*/
        return <Feedback/>
    }
}

ReactDOM.render(
    <Student/>,
    document.getElementById('react-entry')
);
