import React, {Component} from "react";
import ReactDOM from 'react-dom';


class Teacher extends Component {
    render() {
        return (
            <div><p>Teacher index ftw!</p></div>
        )
    }
}

ReactDOM.render(
    <Teacher/>,
    document.getElementById('react-entry')
);
