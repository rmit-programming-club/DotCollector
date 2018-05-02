import React, {Component} from "react";
import ReactDOM from "react-dom";

import Feedback from "./containers/feedback"

import "semantic-ui-css/semantic.min.css";
import "../css/sass/index.sass";
import {Container, Form, Header, Image, Input, Dimmer} from "semantic-ui-react";

import HeaderBar from "../components/header";

import DotLogo from "../../resources/dotlogo.png";
const getSessionByAccessCodeEndpoint = new URL("https://api.dot.hazelfire.org/sessionByAccessCode");
const sessionsEndpoint = "https://api.dot.hazelfire.org/sessions"


class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: false,
            loading: false,
            error: false,

            givenAccessCode: "",
            ended: false
        };
    }

    componentDidMount(){
    }

    checkClosed = () => {
        const {id} = this.state.session;
        const endpoint = sessionsEndpoint + "/" + id;
        fetch(endpoint, {
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).
            then(res => res.json()).
            then(
                (result)=>{
                    if(result.active === false){
                        this.setState({
                            ended: true
                        });
                    }
                },
                (error)=>{
                }
            )
    }

    updateFormState = (e, {name, value}) => {
        this.setState({[name]: value});
        console.log(name, value);
    };

    submitAccessCode = () => {
        if (!this.state.givenAccessCode) {
            console.log("No givenAccessCode");
            return;
        }

        this.setState({
            session: false,
            loading: true,
            error: false
        });

        getSessionByAccessCodeEndpoint.searchParams.append("code", this.state.givenAccessCode);
        fetch(getSessionByAccessCodeEndpoint, {
            headers: new Headers({
                "Content-Type": "application/json"
            })

        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                // Good response.
                response.json().then(data => {
                    this.setState({
                        session: data,
                        loading: false
                    })
                });
            } else {
                // 404 or other status error.
                // TODO neaten this up with the error code and other niceties.
                response.json().then(data => {
                    this.setState({
                        loading: false,
                        error: data
                    })
                });
            }

        }).catch(error => {
            // Network error.
            // TODO display error on screen in a readable format.
            console.log(error);
            this.setState({
                loading: false,
                error: {
                    name: "Connection Error",
                    description: "The connection to the server could not be established."
                }
            })
        });
        this.interval = setInterval(this.checkClosed, 1000);
    };

    render() {
        /* TODO make local styles into classes. */
        console.log(this.state);
        const {session, loading, error, givenAccessCode, ended} = this.state;

        const exitSession = (
            <Dimmer active={ended}>
                <Header as='h2' inverted>The session has now ended, thank you for your feedback</Header>
            </Dimmer>
        );

        const welcome = <Container>
                <Header size="huge" className={"primary-text"} style={{"font-size": "4em"}}>Dot Collector</Header>
                <p className="primary-text subtitle">Please input the session code</p>
                {error ? <p className="primary-text subtitle"><strong>Error!</strong> {error.name}: {error.description}</p> : ""}
                <Form onSubmit={this.submitAccessCode}>
                    <Form.Input size="medium" name="givenAccessCode" value={givenAccessCode} style={{"width": "100px"}} onChange={this.updateFormState} as={Input}>
                        <input style={{"text-align": "center"}}/>
                    </Form.Input> {/* 80 = 6 digit fit perfect. */}
                </Form>
            </Container>;

        return (
            <Dimmer.Dimmable dimmed={false}>
                {exitSession}
                <Container className="trial" textAlign="center">
                    <Image src={DotLogo} centered/>
                    {loading && <Container><Header size="huge" className={"primary-text"} style={{"font-size": "4em"}}>Dot Collector</Header><p className="primary-text">fetching request ...</p></Container>}
                    {!loading && !session && welcome}
                    {!loading && !error && session && <Feedback session={session} allowDim={!ended}/>}
                </Container>
            </Dimmer.Dimmable>
        );
    }
}

export default Student
