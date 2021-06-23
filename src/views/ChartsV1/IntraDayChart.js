import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

function IntraDayChart(props) {

  function getLineData(history) {

    var responseData = []
    if(history !== undefined) {
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
      dataObj.data = data;
      dataObj.name = props.symbol;
      responseData.push(dataObj);
      return responseData;
    }
  }

  function getOptions() {
    var lineOptions = {
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
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
            format: 'HH:mm'
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
            y: props.history.current.priceInfo.previousClose,
              borderColor: '#999',
              label: {
                show: true,
                text: 'previous close ' + props.history.current.priceInfo.previousClose,
              }
          }]
        },
        colors : ['#34A853']
      }
      if(props.history.current.priceInfo.previousClose > props.history.current.priceInfo.lastPrice) {
        lineOptions.colors = ['#EF6E63'];
      }
      return lineOptions;
    }

      useEffect(() => {
        if(props.history.current !== undefined){



        ApexCharts.exec(
          'area-datetime',
          'resetSeries'
        );
      }
    });
    return(
        <>
        <div className="row">
            <div id="chart">
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