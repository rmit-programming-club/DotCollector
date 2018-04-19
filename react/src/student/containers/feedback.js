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
                <Image src={Dotlogo} centered/>
                <Container textAlign="center">
                    <p className="primary-text">Your current session is {accessCode}: {name}</p>
                </Container>
                <Grid doubling stackable centered columns={1}>
                    <Grid.Row only="computer tablet"><Grid.Column largeScreen="8" computer="12" widescreen="8" as={Container}>
                        {QUESTIONS.map((question, i) => <Question onFeedback={(feedback)=>this.sendFeedback(question, feedback)} question={question} key={i}/>)}
                    </Grid.Column></Grid.Row>
                    <Grid.Row only="mobile"><Grid.Column>
                        {QUESTIONS.map((question, i) => <Question question={question} key={i} isMobile/>)}
                    </Grid.Column></Grid.Row>
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
