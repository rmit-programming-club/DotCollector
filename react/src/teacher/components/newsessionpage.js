import React, {Component} from 'react';
import {Header,List, Item} from 'semantic-ui-react';
import SplashScreen from './splash.js'
import RealtimeSession from './realtimesession.js'

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

export default class NewSessionPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            session: {},
            splash: true
        }
    }

    componentDidMount(){
        fetch(sessionsEndpoint, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                'name': this.props.sessionName
            })
        }).
            then(res => res.json()).
            then(
                (result)=>{
                    this.setState({
                        isLoaded: true,
                        session: result
                    });
                },
                (error)=>{
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    }

    render() {
      const { error, isLoaded, items } = this.state;
      if (error) {
        return <div className="new-session-page">Error: {error.message}</div>;
      }
      else if(!isLoaded){
        return <div className="new-session-page">Loading</div>;
      }
      else{
        return (
          <div className="new-session-page">
              { this.state.splash ?
              <SplashScreen code={this.state.session.accessCode} onFeedback={this.toggleSplash}/> :
              <RealtimeSession session={this.state.session} onSplash={this.toggleSplash} onEndSession={this.endSession}/>
              }
          </div>
          );
      }
    }

    toggleSplash = () =>{
        this.setState({splash: !this.state.splash});
    }
    
    endSession = () =>{
        const endpoint = sessionsEndpoint + "/" + this.state.session.id
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
                this.props.onEndSession();
            }
        );
    }
}
