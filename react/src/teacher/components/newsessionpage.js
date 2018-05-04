import React, {Component} from 'react';
import ActiveSessionPage from './activesessionpage'

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

export default class NewSessionPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            session: {}
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
      const { error, isLoaded, session } = this.state;
      if (error) {
        return <div className="new-session-page">Error: {error.message}</div>;
      }
      else if(!isLoaded){
        return <div className="new-session-page">Loading</div>;
      }
      else{
        return (
          <div className="new-session-page">
              <ActiveSessionPage session={this.state.session} onEndSession={this.onEndSession}/>
          </div>
          );
      }
    }

    onEndSession = () =>{
       this.props.onEndSession();
    }
}
