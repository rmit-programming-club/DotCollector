import React, {Component} from 'react';
import {Header,List, Item} from 'semantic-ui-react';

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
      if (error) {
        return <div className="session-listing">Error: {error.message}</div>;
      }
      else if(!isLoaded){
        return <div className="session-listing">Loading</div>
      }
      else{
        return (
          <div className="session-listing">
          <List>
            {items.map(item => (
              <Item><Header>{item.name}</Header></Item>
            ))}
          </List>
          </div>
          );
      }
    }
}
