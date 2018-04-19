import React from 'react';

import {Button, Card, Container, Grid} from 'semantic-ui-react';

const QuestionBox = (props) => {
    const {isMobile, question, onFeedback} = props;
    const {title, min, max} = question;

    console.log(isMobile);
    const buttons = isMobile ? (
        <Button.Group as={Container} basic vertical fluid className="ui 5 buttons" textAlign="center">
            <Button basic color="red" className="basic-red-button">{min}</Button>
            <Button basic color="red" className="basic-red-button">2</Button>
            <Button basic color="red" className="basic-red-button">3</Button>
            <Button basic color="red" className="basic-red-button">4</Button>
            <Button basic color="red" className="basic-red-button">5</Button>
            <Button basic color="red" className="basic-red-button">6</Button>
            <Button basic color="red" className="basic-red-button">{max}</Button>
        </Button.Group>
    ) : (
        <Container className="ui 5 buttons" textAlign="center">
              <Button basic color="red" onClick={()=>onFeedback(1)}className="basic-red-button">{min}</Button>
            {[2,3,4,5,6].map(rating =>(
              <Button basic color="red" onClick={()=>onFeedback(rating)} className="basic-red-button">{rating}</Button> 
            ))}
              <Button basic color="red" onClick={()=>onFeedback(7)} className="basic-red-button">{max}</Button>
        </Container>
    );

    return (
        <div style={{padding: "10px"}}>
            <Card style={{width: "530px"}}>
                <Card.Content>
                    <Card.Header>{title}</Card.Header>
                </Card.Content>
                <Card.Content>
                    {buttons}
                </Card.Content>
            </Card>
        </div>
    )
};

export default QuestionBox
