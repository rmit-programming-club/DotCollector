import React, {Component} from 'react';
import {Header, Button, Grid} from 'semantic-ui-react';
import './splash.css'

export default class SplashScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
    }

    render() {
      return (
        <div className="splash-screen">
          <Grid centered>
            <Grid.Column verticalAlign="middle" textAlign="center">
            <Header>Go to</Header>
            <Header><a href="http://dot.hazelfire.org/student">dot.hazelfire.org/student</a></Header>
            <Header>and enter the following code into your device</Header>
            <Header>{this.props.code}</Header>
            <Button onClick={this.props.onFeedback}>To feedback</Button>
            </Grid.Column>
          </Grid>
        </div>
      );
    }
}
