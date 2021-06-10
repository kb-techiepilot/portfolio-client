import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

import Loading from '../../components/Loading';
import config from '../../config';
import IntraDayChart from './IntraDayChart';
import ChartHeader from './ChartHeader';

function LineChart(props) {

    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [previousPrice, setPreviousPrice] = useState(0);

    const[timeLine, setTimeLine] = useState("one_year");

    const btnClass = "btn white black-text btn-group-border";
    const btnClassWithActive = "btn white black-text btn-group-border btn-group-active-border";


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
  },[props.symbol]);
    

    function getLineData(history) {
        var data = [];
        var dataObj = {};
        var i = 0;
        history.history !== undefined && history.history.forEach(ele => {
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
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        colors: ['#34A853'],
        
        // [
        //   function ({ value, seriesIndex, dataPointIndex, w }) {
        //       if (history.current.priceInfo.lastPrice - previousPrice < 0) {
        //         return "#EA4335";
        //       } else {
        //         return "##34A853";
        //       }
        //     }
        // ]
        // 
      }

      function updateTimeLine(event) {
          event.preventDefault();
          setTimeLine(event.target.name);
      }
      function getPreviousPrice(date) {
        if(history.history !== undefined && timeLine === 'one_day') {
          setPreviousPrice(history.current.priceInfo.previousClose);
        } else {
          history.history !== undefined && history.history.forEach(ele => {
            if(date === ele.CH_TIMESTAMP) {
              setPreviousPrice(ele.CH_CLOSING_PRICE);
            }
          });
        }
      }
  
      useEffect(() => {
        if(history.history != undefined) {
          var startDate = moment().subtract(1, 'year').format("DD MMM YYYY");
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
          var momentDate = moment(startDate);
          var sub = momentDate.day() - 5;
          momentDate = momentDate.day() > 5 
          ? momentDate.subtract(sub, 'day')
            : 
            momentDate;
          getPreviousPrice(momentDate.format("YYYY-MM-DD"));

        }
      },[timeLine]);
    return(
        <>
        <div className="btn-group" role="group">
            <a className={timeLine === 'one_day' ? btnClassWithActive : btnClass } href="#!" onClick={updateTimeLine} name="one_day">1D</a>
            <a className={timeLine === 'five_days' ? btnClassWithActive : btnClass } href="#!" onClick={updateTimeLine} name="five_days">5D</a>
            <a className={timeLine === 'one_month' ? btnClassWithActive : btnClass } href="#!" onClick={updateTimeLine} name="one_month">1M</a>
            <a className={timeLine === 'six_months' ? btnClassWithActive : btnClass } href="#!" onClick={updateTimeLine} name="six_months">6M</a>
            <a className={timeLine === 'ytd' ? btnClassWithActive : btnClass } href="#!" onClick={updateTimeLine} name="ytd">YTD</a>
            <a className={timeLine === 'one_year' ? btnClassWithActive : btnClass } href="#!" onClick={updateTimeLine} name="one_year">1Y</a>
        </div>
        {history.current != undefined ? 
          <ChartHeader current={history.current} previousClosing={previousPrice} timeLine={timeLine}/>
        :
        <></>
        }
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