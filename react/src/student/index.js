import React, {Component} from "react";
import ReactDOM from 'react-dom';

import Feedback from './containers/feedback'

import 'semantic-ui-css/semantic.min.css';
import '../css/sass/index.sass';
import {Container, Header, Image, Input} from 'semantic-ui-react';

import HeaderBar from '../components/header';

import DotLogo from '../../dist/html/resources/dotlogo.png';


class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: false
        }
    }

    someFunction = () => {
        this.setState({session: "123456"})
    };

    render() {
        /* TODO make local styles into classes. */
        const {session} = this.state;
        const welcome = <Container className="trial" textAlign="center">
                <Image src={DotLogo} style={{display: "block", margin: "0 auto"}} centered/>
                <Header size="huge" className={"primary-text"} style={{"font-size": "4em"}}>Dot Collector</Header>
                <p className="primary-text subtitle">Please input the session name</p>
                <form onSubmit={this.someFunction}>
                <Input size="medium" style={{"width": "100px"}}>
                    <input style={{"text-align": "center"}}/>
                </Input> {/* 80 = 6 digit fit perfect. */}
                </form>
            </Container>;
        return (
            <div>
                {!session && welcome}
                {session && <Feedback/>}
            </div>
        );
    }
}

ReactDOM.render(
    <Student/>,
    document.getElementById('react-entry')
);
