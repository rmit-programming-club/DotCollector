import React, {Component} from 'react';

import {Dimmer, Loader, Header, Button, Card, Container, Grid} from 'semantic-ui-react';

class QuestionBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            timeout: 0
        };
    }
    
    render() {
        const {isMobile, question, onFeedback} = this.props;
        const {title, min, max} = question;

        const buttons = (
          <div>
              <Button basic color="red" onClick={()=>this.onFeedback(1)}className="basic-red-button">{min}</Button>
              {[2,3,4].map(rating =>(
              <Button basic color="red" onClick={()=>this.onFeedback(rating)} className="basic-red-button">{rating}</Button> 
              ))}
              <Button basic color="red" onClick={()=>this.onFeedback(5)} className="basic-red-button">{max}</Button>
          </div>
        );
        const buttonGroups = isMobile ? (
            <Button.Group as={Container} basic vertical fluid className="ui 5 buttons" textAlign="center">
              {buttons}
            </Button.Group>
        ) : (
            <Container className="ui 5 buttons" textAlign="center">
                  {buttons}
            </Container>
        );

        return (
            <div style={{padding: "10px"}}>
                <Dimmer.Dimmable>
                <Card style={{width: "530px"}}>
                        <Dimmer active={this.state.timeout > 0}>
                            <Loader />
                            <Header inverted>{this.state.timeout}</Header>
                        </Dimmer>
                        <Card.Content>
                            <Card.Header>{title}</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            {buttonGroups}
                        </Card.Content>
                </Card>
                </Dimmer.Dimmable>
            </div>
        )
    }

    timeoutTick = () =>{
        let timeout = this.state.timeout - 1;
        if(timeout == 0){
            this.setState({
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

    onFeedback = (rating)=>{
        this.setState({
            timeout: 60
        });
        this.intervalId = setInterval(this.timeoutTick, 1000);
        this.props.onFeedback(rating);
    }
}

export default QuestionBox
