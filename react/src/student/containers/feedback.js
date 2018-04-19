import React, {Component} from 'react';
import {Grid, Container, Image} from 'semantic-ui-react';

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
        title: "Do you understand the content?2",
        min: "Not at all.",
        max: "Wholly."
    }, {
        title: "Do you understand the content?3",
        min: "Not at all.",
        max: "Wholly."
    }, {
        title: "Do you understand the content?4",
        min: "Not at all.",
        max: "Wholly."
    }, {
        title: "Do you understand the content?5",
        min: "Not at all.",
        max: "Wholly."
    }
];

const sessionsEndpoint = 'https://api.dot.hazelfire.org/sessions/'

export default class Feedback extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {session} = this.props;
        const {accessCode, name, id} = session;
        // TODO adjust styling here
        return (
            <div>
                <Container textAlign="center">
                    <p className="primary-text">Your current session is {accessCode}: {name}</p>
                </Container>
                <Grid doubling stackable centered columns={1}>
                    <Grid.Row only="computer tablet">
                        {QUESTIONS.map((question, i) => <Question onFeedback={(feedback)=>this.sendFeedback(question, feedback)} question={question} key={i}/>)}
                    </Grid.Row>
                    <Grid.Row only="mobile">
                        {QUESTIONS.map((question, i) => <Question question={question} key={i} isMobile/>)}
                    </Grid.Row>
                </Grid>
            </div>
        )
    }

    sendFeedback = (question, feedback)=>{
        const {session} = this.props;
        const {id} = session;

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
