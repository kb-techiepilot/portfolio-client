import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

import Loading from '../../components/Loading';
import config from '../../config';
import IntraDayChart from './IntraDayChart';

function LineChart(props) {

    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const[timeLine, setTimeLine] = useState("");


    useEffect(() => {

      var startDate = moment().subtract(1, 'year').format("YYYY-MM-DD");
      var endDate = moment().format("YYYY-MM-DD");

      axios
      .get(config.apiBaseUrl+"/api/v1/history/" + props.symbol, {
          params: {
              'start': startDate,
              'end': endDate
          }})
      .then(res => {
          setLoading(false);
          setHistory(res.data);
          })
      .catch(err =>{
        console.log(err.message);
      });
  },[props]);
    

    function getLineData(history) {
        var data = [];
        var dataObj = {};
        var i = 0;
        history.forEach(ele => {
          var date = new Date(ele.CH_TIMESTAMP).getTime();
            data[i] = [date, ele.CH_CLOSING_PRICE];
            i++;
        });
        var responseData = [];
        dataObj.data = data;
        dataObj.name = props.symbol;
        responseData.push(dataObj);
        return responseData;
    }

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
            format: 'dd-MM-yyyy'
          }
        },
        title: {
          text: props.symbol,
          align: 'center'
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
        colors: ['#66DA26']
      }

      function updateTimeLine(event) {
          event.preventDefault();
          setTimeLine(event.target.name);
      }
  
      useEffect(() => {
        if(history.length != 0) {
          var startDate;
          var endDate = moment().format("DD MMM YYYY");
          if(timeLine === 'one_year') {
              ApexCharts.exec(
                  'area-datetime',
                  'resetSeries'
              );
          }
          else {
              switch(timeLine) {
                case "five_days" :
                    startDate = moment().subtract(5, 'day').format("DD MMM YYYY");
                    break;
                case "one_month" :
                    startDate = moment().subtract(1, 'month').format("DD MMM YYYY");
                    break;
                  case "six_months":
                      startDate = moment().subtract(6, 'month').format("DD MMM YYYY");
                      break;
                  case "ytd":
                      startDate = "01 Jan " + moment().year();
                      break;
              }
              ApexCharts.exec(
                  'area-datetime',
                  'zoomX',
                  new Date(startDate).getTime(),
                  new Date(endDate).getTime()
              );
          }
        }
      },[timeLine]);
    return(
        <>
        <div className="btn-group" role="group">
            <a className="btn" href="#!" onClick={updateTimeLine} name="one_day">1D</a>
            <a className="btn btn-inactive" href="#!" onClick={updateTimeLine} name="five_days">5D</a>
            <a className="btn" href="#!" onClick={updateTimeLine} name="one_month">1M</a>
            <a className="btn btn-inactive" href="#!" onClick={updateTimeLine} name="six_months">6M</a>
            <a className="btn" href="#!" onClick={updateTimeLine} name="ytd">YTD</a>
            <a className="btn btn-inactive" href="#!" onClick={updateTimeLine} name="one_year">1Y</a>
        </div>
        <div className="row">
            <div id="chart">
                <div id="chart-timeline">
                    {!loading ? 
                    timeLine === 'one_day' ?
                    <IntraDayChart symbol={props.symbol} />
                    :
                    <Chart options={lineOptions}
                        series={getLineData(history)}
                        type="area" height={350} />
                        :
                        <Loading />
                    }
                </div>
            </div>
        </div>
        </>
    )
}


export default LineChart;