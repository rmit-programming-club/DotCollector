import React, {Component} from 'react';
import {Button, Menu, Item, Header} from 'semantic-ui-react';

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

export default class SessionList extends Component{
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    }

    componentDidMount(){
        fetch(sessionsEndpoint, {
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).
            then(res => res.json()).
            then(
                (result)=>{
                    this.setState({
                        isLoaded: true,
                        items: result
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
      const activeSessions = items.filter((session) => session.active);
      const inactiveSessions = items.filter((session) => !session.active);
      if (error) {
        return <div className="session-listing">Error: {error.message}</div>;
      }
      else if(!isLoaded){
        return <div className="session-listing">Loading</div>
      }
      else{
        return (
          <div className="session-listing">
          <Header>Active Sessions</Header>
          <Menu secondary={true} vertical={true} fluid={true}>
            {activeSessions.map(this.sessionButton)}
          </Menu>
          <Header>Inactive Sessions</Header>
          <Menu secondary={true} vertical={true} fluid={true}>
            {inactiveSessions.map(this.sessionButton)}
          </Menu>
          </div>
          );
      }
    }

    sessionButton = (session, index) => (
        <a className="item" key={index} onClick={(e)=>this.props.onOpenSession(e, session)}>
            {session.name}
            <Button floated="right" onClick={()=>this.deleteSession(session.id)} >Delete</Button>
            <div style={{clear: 'both'}} ></div>
        </a>
    )

    deleteSession = (id) =>{
        this.setState({isLoaded: false})
        fetch(sessionsEndpoint + "/" + id, {
            headers: new Headers({}),
            method: "DELETE"
        }).
            then(
                (result)=>{
                    let items = this.state.items;
                    items = items.filter((item)=>item.id !== id)
                    this.setState({
                        isLoaded: true,
                        items: items
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
}
