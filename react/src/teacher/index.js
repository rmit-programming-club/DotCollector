import React, {Component} from "react";
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Image} from 'semantic-ui-react';

import DotLogo from '../../html/resources/dotlogo.png';
import '../css/sass/index.sass';

import HeaderBar from './components/header'
import SessionListing from './components/sessions'
import CreateSessionModal from './components/createsessionmodal'


class Teacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modalOpen: false
        }

        this.newSession = this.newSession.bind(this)
        this.openSessionDialogue = this.openSessionDialogue.bind(this)
    }

    render() {
        return (
            <div className={"teacher-background"}>
              <HeaderBar />
              <Button onClick={this.openSessionDialogue}>New Session</Button>
              <CreateSessionModal onSubmit={this.newSession} isOpen={this.state.modalOpen}/>
              <SessionListing />
            </div>
        )
    }

    newSession(name){
        console.log(name);
        this.setState({modalOpen: false});
    }
    openSessionDialogue(e){
        this.setState({modalOpen: true});
    }
}
ReactDOM.render(
    <Teacher/>,
    document.getElementById('react-entry')
);
