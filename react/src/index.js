import React, {Component} from "react";
import {BrowserRouter, browserHistory, Route, Switch} from "react-router-dom";
import ReactDOM from "react-dom";

import Student from "./student/index.js"
import Teacher from "./teacher/index.js"

const Home = () => (
    <h1>Home</h1>
);

ReactDOM.render(
    <BrowserRouter history={browserHistory}>
      <Switch>
        <Route path="/student" component={Student} />
        <Route path="/teacher" component={Teacher} />
        <Route exact path="/" component={Home} />
      </Switch>
    </BrowserRouter>,
    document.getElementById("react-entry")
);
