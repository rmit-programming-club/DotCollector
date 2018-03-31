import React, {Component} from 'react';
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
            <div >
                {QUESTIONS.map((question, i) => <Question question={question} key={i}/>)}
            </div>
        )
    }
}
