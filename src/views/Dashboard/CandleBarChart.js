import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

import Loading from '../../components/Loading';
import config from '../../config';
import ChartHeader from './ChartHeader';

function CandleBarChart(props) {
    
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
    },[props]);
    

    function getData(history) {
        var data = [];
        var dataObj = {};
        history.history !== undefined && history.history.forEach(ele => {
            dataObj.x = ele.CH_TIMESTAMP;
            dataObj.y = [ele.CH_OPENING_PRICE, ele.CH_TRADE_HIGH_PRICE, ele.CH_TRADE_LOW_PRICE, ele.CH_CLOSING_PRICE]
            data.push(dataObj);
            dataObj = {};
        });
        var responseData = [];
        var responseObj = {};
        responseObj.data = data;
        responseData.push(responseObj);
        return responseData;
    }

    var options = {
        chart: {
        id: 'area-datetime',
        type: 'candlestick',
        zoom: {
            enabled: true,
            type: 'x',  
            autoScaleYaxis: true, 
        }
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      },
      selection: 'one_year',
      noData: {
        text: 'Loading...'
      }
      };

    function updateTimeLine(event) {
        event.preventDefault();
        setTimeLine(event.target.name);
    }

    useEffect(() => {
        if(history.history != undefined) {
            var startDate = moment().subtract(1, 'year');
            var endDate = moment().format("DD MMM YYYY");
            if(timeLine === 'one_year') {
                ApexCharts.exec(
                    'area-datetime',
                    'resetSeries'
                );
            }
            else {
                switch(timeLine) {
                    case "one_month" :
                        startDate = moment().subtract(1, 'month').format("DD MMM YYYY");
                        break;
                    case "three_months" :
                        startDate = moment().subtract(3, 'month').format("DD MMM YYYY");
                        break;
                    case "six_months":
                        startDate = moment().subtract(6, 'month').format("DD MMM YYYY");
                        break;
                    case "nine_months" :
                        startDate = moment().subtract(9, 'month').format("DD MMM YYYY");
                        break;
                    case "ytd":
                        startDate = "01 Jan " + moment().year();
                        break;
                }
                startDate = moment(startDate);
                if(startDate.day() === 6) {
                  startDate = startDate.subtract(5, 'day');
                } else if(startDate.day() === 0) {
                    startDate = startDate.subtract(2, 'day');
                }
                startDate = startDate;
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date(startDate.format("DD MMM YYYY")).getTime(),
                    new Date(endDate).getTime()
                );
            }
            getPreviousPrice(startDate.format("YYYY-MM-DD"));
        }
        
    },[timeLine]);

    function getPreviousPrice(date) {
        console.log(date);
        history.history !== undefined && history.history.forEach(ele => {
            if(date === ele.CH_TIMESTAMP) {
            setPreviousPrice(ele.CH_CLOSING_PRICE);
            }
        });
    }
    return(
        <>
        <div className="btn-group" role="group">
            <a className={timeLine === 'one_month' ? btnClassWithActive : btnClass }  href="#" onClick={updateTimeLine} name="one_month">1M</a>
            <a className={timeLine === 'three_months' ? btnClassWithActive : btnClass }  href="#" onClick={updateTimeLine} name="three_months">3M</a>
            <a className={timeLine === 'six_months' ? btnClassWithActive : btnClass }  onClick={updateTimeLine} name="six_months">6M</a>
            <a className={timeLine === 'nine_months' ? btnClassWithActive : btnClass }  onClick={updateTimeLine} name="nine_months">9M</a>
            <a className={timeLine === 'ytd' ? btnClassWithActive : btnClass }  href="#" onClick={updateTimeLine} name="ytd">YTD</a>
            <a className={timeLine === 'one_year' ? btnClassWithActive : btnClass }  onClick={updateTimeLine} name="one_year">1Y</a>
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
                    <Chart options={options}
                        series={getData(history)}
                        type="candlestick" height={350} />
                        :
                        <Loading />
                    }
                </div>
            </div>
        </div>
        </>
    )
}


export default CandleBarChart;