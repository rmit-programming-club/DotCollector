import React, {Component} from 'react';
import SplashScreen from './splash.js'
import RealtimeSession from './realtimesession.js'

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

export default class ActiveSessionPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            session: {},
            splash: true
        }
    }

    render() {
      return (
          <div className="new-session-page">
              { this.state.splash ?
              <SplashScreen code={this.props.session.accessCode} onFeedback={this.toggleSplash}/> :
              <RealtimeSession session={this.props.session} onSplash={this.toggleSplash} onEndSession={this.onEndSession}/>
              }
          </div>
      );
    }

    toggleSplash = () =>{
        this.setState({splash: !this.state.splash});
    }
    
    onEndSession = () =>{
        const endpoint = sessionsEndpoint + "/" + this.props.session.id
        fetch(endpoint, {
            method: 'PATCH',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                'active': false
            })
        }).
        then(
            (result)=>{
                this.props.onEndSession();
            },
            (error)=>{
                console.log(error);
                this.props.onEndSession();
            }
        );
    }
}
