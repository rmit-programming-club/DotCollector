import React, {Component} from "react";
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import {Header, Image} from 'semantic-ui-react';

import DotLogo from '../../../resources/dotlogo.png';
import '../css/sass/index.sass';


class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        /* TODO make local styles into classes. */
        return (
            <div className={"trial"}>
                <Image src={DotLogo} style={{display: "block", margin: "0 auto"}}/>
                <Header size="huge" className={"primary-text"} style={{"font-size": "4em"}}>Dot Collector</Header>
            </div>
        )
    }
}

ReactDOM.render(
    <Student/>,
    document.getElementById('react-entry')
);
