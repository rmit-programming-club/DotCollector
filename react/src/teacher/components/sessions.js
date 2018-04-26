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
      if (error) {
        return <div className="session-listing">Error: {error.message}</div>;
      }
      else if(!isLoaded){
        return <div className="session-listing">Loading</div>
      }
      else{
        return (
          <div className="session-listing">
          <Menu secondary={true} vertical={true} fluid={true}>
            {items.map((item, i) => (
                <a className="item" key={i} onClick={(e)=>this.props.onOpenSession(e, item)}>
                    {item.name}
                    <Button floated="right" onClick={()=>this.deleteSession(item.id)} >Delete</Button>
                    <div style={{clear: 'both'}} ></div>
                </a>
            ))}
          </Menu>
          </div>
          );
      }
    }

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
