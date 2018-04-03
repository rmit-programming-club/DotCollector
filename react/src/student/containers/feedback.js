import React, {Component} from 'react';
import {Grid, Container, Image} from 'semantic-ui-react';

import Dotlogo from '../../../html/resources/dotlogo.png'
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

export default class Feedback extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Image src={Dotlogo} centered/>
                <Container textAlign="center">
                    <p className="primary-text">Your current session is XXX-XXX: User Centered Design</p>
                </Container>
                <Grid doubling stackable centered columns={1}>
                    <Grid.Row only="computer tablet"><Grid.Column largeScreen="8" computer="12" widescreen="8" as={Container}>
                        {QUESTIONS.map((question, i) => <Question question={question} key={i}/>)}
                    </Grid.Column></Grid.Row>
                    <Grid.Row only="mobile"><Grid.Column>
                        {QUESTIONS.map((question, i) => <Question question={question} key={i} isMobile/>)}
                    </Grid.Column></Grid.Row>
                </Grid>
            </div>
        )
    }
}
