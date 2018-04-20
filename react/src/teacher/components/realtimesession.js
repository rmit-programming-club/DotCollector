import React, {Component} from 'react';
import {Button, List, Item} from 'semantic-ui-react';
import ScatterChart from './scatterchart.js'

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions'

const QUESTIONS = [
    "What is the pace of the lecture?",
    "Do you understand the content?"
]

export default class RealtimeSession extends Component{
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            feedback: []
        };
    }

    componentDidMount(){
        this.interval = setInterval(this.updateSession, 10000);
        this.updateSession()
    }


    updateSession = ()=>{
        const {id} = this.props.session;
        const endpoint = sessionsEndpoint + "/" + id;
        fetch(endpoint, {
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).
            then(res => res.json()).
            then(
                (result)=>{
                    this.setState({
                        isLoaded: true,
                        feedback: result.feedback
                    });
                },
                (error)=>{
                    this.setState({
                        isLoaded: true,
                        error: error,
                        feedback: []
                    });
                }
            )
    }

    render() {
        let graphData = new Map(QUESTIONS.map((item) => [item, []]));
        for(const feedback of this.state.feedback){
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
          <div className="realtime-session">
              <div className="realtime-graphs">
              {charts}
              </div>
              <Button onClick={this.props.onSplash}>Show Splash</Button>
          </div>
          );
    }
}
