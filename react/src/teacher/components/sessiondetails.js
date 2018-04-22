import React, {Component} from 'react';
import {Header,List, Item, Button} from 'semantic-ui-react';
import ScatterChart from './scatterchart.js'
import RealtimeSession from './realtimesession.js'

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

const QUESTIONS = [
    "What is the pace of the lecture?",
    "Do you understand the content?"
]

export default class SessionDetailsPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false
        }
    }

    render() {
        const session = this.props.session;
        let graphData = new Map(QUESTIONS.map((item) => [item, []]));
        for(const feedback of session.feedback){
            const dataPoint = {
                x: new Date(feedback.timestamp * 1000),
                y: feedback.value
            };
            const currentFeedback = graphData.get(feedback.question);
            currentFeedback.push(dataPoint);
            graphData.set(feedback.question, currentFeedback);
        }
        
        const charts = Array.from(graphData.entries()).map((question, i) => (<ScatterChart key={i} data={question[1]} name={question[0]} /> ))
        return (
          <div className="session-details">
          <Header>{session.name}</Header>
          {charts}
          <Button onClick={this.props.onExit}>Exit</Button>
          </div>
          );
    }
}
