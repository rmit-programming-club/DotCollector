import React, {Component} from "react";
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Image} from 'semantic-ui-react';

import DotLogo from '../../resources/dotlogo.png';
import '../css/sass/index.sass';

import HeaderBar from '../components/header'
import SessionListing from './components/sessions'
import CreateSessionModal from './components/createsessionmodal'
import NewSessionPage from './components/newsessionpage'


class Teacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modalOpen: false,
          splashOpen: false,
          sessionName: ""
        };
    }

    render() {
        if(!this.state.splashOpen){
        return (
            <div className={"teacher-background"}>
              <HeaderBar />
              <Button onClick={this.openSessionDialogue}>New Session</Button>
              <CreateSessionModal onSubmit={this.newSession} isOpen={this.state.modalOpen}/>
              <SessionListing />
            </div>
        )
        }
        else{
            return (
                <div className={"teacher-background"}>
                    <HeaderBar />
                    <NewSessionPage sessionName={this.state.sessionName} onEndSession={this.endSession}/> 
                </div>
          )
        }
    }

    newSession = (name) => {
        console.log(name);
        this.setState({modalOpen: false, splashOpen: true, sessionName: name});
    }
    
    endSession =  () => {
        this.setState({splashOpen: false});
    }

    openSessionDialogue = (e) => {
        this.setState({modalOpen: true});
    }
}
ReactDOM.render(
    <Teacher/>,
    document.getElementById('react-entry')
);
