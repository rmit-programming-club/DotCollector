import React, {Component} from 'react';
import {Header, Button} from 'semantic-ui-react';
import Chart from 'chart.js'

export default class ScatterChart extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render() {
      let canvasRef = React.createRef();
      let canvas = <canvas width=200 height=150 ref={canvasRef}></canvas>;
      ctx = canvasRef.current.getContext();

      return (
        <div className="scatter-chart">
        </div>
      );
    }
}
