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
    };

    submitAccessCode = () => {
        if (!this.state.givenAccessCode) {
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
        const {session, loading, error, givenAccessCode, ended} = this.state;

        const welcome = <Container>
                <Header size="huge" className={"primary-text"} style={{"fontSize": "4em"}}>Dot Collector</Header>
                <p className="primary-text subtitle">Please input the session code</p>
                {error ? <p className="primary-text subtitle"><strong>Error!</strong> {error.name}: {error.description}</p> : ""}
                <Form onSubmit={this.submitAccessCode}>
                    <Form.Input size="medium" name="givenAccessCode" value={givenAccessCode} style={{"width": "100px"}} onChange={this.updateFormState}>
                        <input style={{"textAlign": "center"}}/>
                    </Form.Input> {/* 80 = 6 digit fit perfect. */}
                </Form>
            </Container>;

        return (
            <Container className="trial" textAlign="center">
                <Image src={DotLogo} centered/>
                {loading && <Container><Header size="huge" className={"primary-text"} style={{"font-size": "4em"}}>Dot Collector</Header><p className="primary-text">fetching request ...</p></Container>}
                {!loading && !session && !ended && welcome}
                {!loading && !error && session && !ended && <Feedback session={session} allowDim={!ended}/>}
                {ended && <Header>The session has ended. Thank you for your feedback</Header>}
            </Container>
        );
    }
}

export default Student
