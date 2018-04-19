import React, {Component} from 'react';
import {Header, Button} from 'semantic-ui-react';

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
          <Header>Go to</Header>
          <Header><a href="dot.hazelfire.org/student.html">dot.hazelfire.org/student.html</a></Header>
          <Header>and enter the following code into your device</Header>
          <Header>{this.props.code}</Header>
          <Button OnClick={this.props.onFeedback}>To feedback</Button>
        </div>
      );
    }
}
