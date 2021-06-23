import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

function IntraDayChart(props) {

  function getLineData(history) {

    var responseData = []
    if(history.intra !== undefined) {
      var dataObj = {};
      var data = [];
      
      var j = 1;
      data[0] = history.intra[0];
      for(var i = 1; i < history.intra.length-1; i++){
          if(history.intra[i][0] - data[j-1][0] > 300000 ){
              data[j] = history.intra[i];
              j++;
          }
      }
      data[j] = history.intra[history.intra.length-1];
      dataObj.data = data;
      dataObj.name = props.symbol;
      responseData.push(dataObj);
      return responseData;
    }
  }

  function getOptions() {
    var lineOptions = {
        chart: {
          id: props.chartId,
          type: 'area',
          height: 250,
          zoom: {
            autoScaleYaxis: true
          },
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
        },
        tooltip: {
          x: {
            format: 'dd-MMM HH:mm'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        annotations : {
          yaxis : [{
            y: props.previousClose,
              borderColor: '#999',
              label: {
                show: true,
                text: 'previous close ' + props.previousClose,
              }
          }]
        },
        colors : ['#34A853']
      }
      if(props.previousClose > props.lastPrice) {
        lineOptions.colors = ['#EF6E63'];
      }
      return lineOptions;
    }

    useEffect(() => {
      if(props.history !== undefined){
        ApexCharts.exec(
          props.chartId,
          'resetSeries'
        );
      }
    });
    return(
        <>
        <div className="row">
            <div id="chart1">
                <div id="chart-timeline">
                    <Chart options={getOptions()}
                        series={getLineData(props.history)}
                        type="area" height={350} />
                </div>
            </div>
        </div>
        </>
    )
}


export default IntraDayChart;