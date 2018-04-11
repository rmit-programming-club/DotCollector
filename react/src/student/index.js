import React, {Component} from "react";
import ReactDOM from "react-dom";

import Feedback from "./containers/feedback"

import "semantic-ui-css/semantic.min.css";
import "../css/sass/index.sass";
import {Container, Form, Header, Image, Input} from "semantic-ui-react";

import HeaderBar from "../components/header";

import DotLogo from "../../resources/dotlogo.png";
const getSessionByAccessCodeEndpoint = new URL("https://api.dot.hazelfire.org/sessionByAccessCode");


class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: false,
            loading: false,
            error: false,

            givenAccessCode: ""
        };
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
                response.json().then(data => {
                    this.setState({
                        loading: false,
                        error: data
                    })
                });
            }

        }).catch(error => {
            // Network error.
            console.log(error);
        });
    };

    render() {
        /* TODO make local styles into classes. */
        console.log(this.state);
        const {session, loading, error, givenAccessCode} = this.state;

        const welcome = <Container className="trial" textAlign="center">
                <Image src={DotLogo} style={{display: "block", margin: "0 auto"}} centered/>
                <Header size="huge" className={"primary-text"} style={{"font-size": "4em"}}>Dot Collector</Header>
                <p className="primary-text subtitle">Please input the session name</p>
                {error ? <p className="primary-text subtitle"><strong>Error!</strong> {error.name}: {error.description}</p> : ""}
                <Form onSubmit={this.submitAccessCode}>
                    <Form.Input size="medium" name="givenAccessCode" value={givenAccessCode} style={{"width": "80px"}} onChange={this.updateFormState} /> {/* 80 = 6 digit fit perfect. */}
                </Form>
            </Container>;
        return (
            <div>
                {loading && <Container textAlign="center"><p className="primary-text">Loading fam.</p></Container>}
                {!loading && !session && welcome}
                {!loading && !error && session && <Feedback session={session}/>}
            </div>
        );
    }
}

ReactDOM.render(
    <Student/>,
    document.getElementById("react-entry")
);
