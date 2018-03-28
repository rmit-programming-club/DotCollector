import React, {Component} from "react";
import ReactDOM from 'react-dom';


class Student extends Component {
    render() {
        return (
            <div><p>Student index ftw!</p></div>
        )
    }
}

ReactDOM.render(
    <Student/>,
    document.getElementById('react-entry')
);
