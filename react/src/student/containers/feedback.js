import React, {Component} from 'react';
import {Header, Dimmer, Loader, Grid, Container, Image} from 'semantic-ui-react';

import Dotlogo from '../../../resources/dotlogo.png'
import Question from '../components/question-box';

const QUESTIONS = [
    {
        title: "What is the pace of the lecture?",
        min: "Too slow.",
        max: "Too fast."
    }, {
        title: "Do you understand the content?",
        min: "Not at all.",
        max: "Wholly."
    }, {
        title: "Do you find the content interesting?",
        min: "Not at all.",
        max: "Incredibly."
    }];

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions/'

export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
          sending: false,
          timout: 0
        };
    }

    render() {
        const {session, allowDim} = this.props;
        const {accessCode, name, id} = session;
        const {sending, timeout} = this.state;
        // TODO adjust styling here
        
        const dimmer = (
            <Dimmer active={sending && allowDim}>
                <Loader />
                <Header inverted>Please wait {timeout} seconds to enter feedback</Header>
            </Dimmer>
        );
        return (
            <div>
                {dimmer}
                <Container textAlign="center">
                    <p className="primary-text">Your current session is {accessCode}: {name}</p>
                </Container>
                <Grid doubling stackable centered columns={1}>
                    <Grid.Row only="computer tablet">
                        {QUESTIONS.map((question, i) => <Question onFeedback={(feedback)=>this.sendFeedback(question, feedback)} question={question} key={i}/>)}
                    </Grid.Row>
                    <Grid.Row only="mobile">
                        {QUESTIONS.map((question, i) => <Question onFeedback={(feedback)=>this.sendFeedback(question, feedback)} question={question} key={i} isMobile/>)}
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
    
    timeoutTick = () =>{
        let timeout = this.state.timeout;
        timeout--;
        if(timeout == 0){
            this.setState({
                sending: false,
                timeout: 0
            });
            clearInterval(this.intervalId);
        }
        else{
            this.setState({
                timeout: timeout
            });
        }
    }

    sendFeedback = (question, feedback)=>{
        const {session} = this.props;
        const {id} = session;
        this.setState({
            sending: true,
            timeout: 60
        });
        this.intervalId = setInterval(this.timeoutTick, 1000);

        const endpoint = sessionsEndpoint + id + "/feedback"

        const body = {
          'question': question.title,
          'value': feedback
        }
        fetch(endpoint, {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'post',
            body: JSON.stringify(body)
        }).
            then(
                (result)=>{
                    if(result.status == 204){
                        console.log("Success");
                    }
                    else{
                        console.log("Error");
                        console.log(result);
                    }
                }
            )
    }
}
