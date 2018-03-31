import React from 'react';

import {Button, Card, Container, Grid} from 'semantic-ui-react';

const QuestionBox = (props) => {
    const {title, min, max} = props.question;
    return (
        <div style={{padding: "10px"}}>
            <Card>
                <Card.Content>
                    <Card.Header>{title}</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Grid columns={2}>
                        <Grid.Column>
                            <Container textAlign="left">{min}</Container>
                        </Grid.Column>
                        <Grid.Column>
                            <Container textAlign="right">{max}</Container>
                        </Grid.Column>
                    </Grid>
                    <Container className="ui 5 buttons" textAlign="center">
                        <Button color="green" basic className="basic-red-button">1</Button>
                        <Button color="green" basic className="basic-red-button">2</Button>
                        <Button color="green" basic className="basic-red-button">3</Button>
                        <Button color="green" basic className="basic-red-button">4</Button>
                        <Button color="green" basic className="basic-red-button">5</Button>
                    </Container>
                </Card.Content>
            </Card>
        </div>
    )
};

export default QuestionBox
