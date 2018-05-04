import React, {Component} from 'react';
import {Header, Button} from 'semantic-ui-react';
import Chart from 'chart.js'
import './scatter.css'

export default class ScatterChart extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    
    loadChart = (element) =>{
        if(element)
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
            maintainAspectRatio: false,
              scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'minute'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            suggestedMin: 1,
                            suggestedMax: 5
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
      let canvas = <canvas ref={this.loadChart} />;

      return (
        <div className="scatter-chart">
          {canvas}
        </div>
      );
    }
}
