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
import SessionDetailsPage from './components/sessiondetails'


class Teacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modalOpen: false,
          splashOpen: false,
          sessionName: "",
          sessionDetailsOpen: false,
          session: null
        };
    }

    render() {
        let content;
        if(!this.state.splashOpen && !this.state.sessionDetailsOpen){
            content = ( <div>
              <Button onClick={this.openSessionDialogue}>New Session</Button>
              <CreateSessionModal onSubmit={this.newSession} isOpen={this.state.modalOpen}/>
              <SessionListing onOpenSession={this.openSession}/>
              </div>
            );
        }
        else if(this.state.sessionDetailsOpen){
            content = <SessionDetailsPage session={this.state.session} onExit={this.openListing}/>;
        }
        else{
            content = <NewSessionPage sessionName={this.state.sessionName} onEndSession={this.endSession}/>;
        }
        return (
            <div className={"teacher-background"}>
              <HeaderBar />
              {content}
            </div>
        )
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

    openSession = (e, session) =>{
        if(e.target !== e.currentTarget) return;
        this.setState({sessionDetailsOpen: true, session: session});
    }

    openListing = () =>{
        this.setState({sessionDetailsOpen: false});
    }
}

export default Teacher
