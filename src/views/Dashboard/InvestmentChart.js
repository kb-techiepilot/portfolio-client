import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 53, 85, 41, 44, 65],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  };

function InvestmentChart() {


    return(
        <div id="revenue-chart" className="card animate fadeUp">
            <div className="card-content">
                <h4 className="header mt-0">
                    Investments for JUNE
                    <span className="purple-text small text-darken-1 ml-1">
                        {/* <i className="material-icons">keyboard_arrow_up</i> */}
                    </span>
                    <a className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow right">Details</a>
                </h4>
                <div className="row">
                    <div className="col s12">
                        <Line data={data}/>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default InvestmentChart;