import React, {Component} from 'react';
import {Header, Button} from 'semantic-ui-react';
import Chart from 'chart.js'

export default class ScatterChart extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    
    loadChart = (element) =>{
        this.ctx = element.getContext("2d");
    }
    
    componentDidMount(){
        this.refreshChart(this.ctx);
    }
  
    refreshChart = (context) =>{
        new Chart(context, {
          type: 'scatter',
          data: {
              datasets: [{
                  backgroundColor: "rgba(220,0,0,0.5)",
                  label: this.props.name,
                  data: this.props.data
              }]
          },
          options: {
              scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'minute'
                        }
                    }]
                }
            }
        })
    }

    render() {
      if(this.ctx){
          this.refreshChart(this.ctx);
      }
      let canvas = <canvas width="200" height="150" ref={this.loadChart} />;

      return (
        <div className="scatter-chart">
          {canvas}
        </div>
      );
    }
}
