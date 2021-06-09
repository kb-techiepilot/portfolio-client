import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

import Loading from '../../components/Loading';
import config from '../../config';

function CandleBarChart(props) {

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
    

    function getData(history) {
        var data = [];
        var dataObj = {};
        history.forEach(ele => {
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
        var startDate;
        var endDate = moment().format("DD MMM YYYY");
        console.log(endDate);
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
                case "six_months":
                    startDate = moment().subtract(6, 'month').format("DD MMM YYYY");
                    break;
                case "ytd":
                    startDate = "01 Jan " + moment().year();
                    break;
            }
            console.log(startDate);
            ApexCharts.exec(
                'area-datetime',
                'zoomX',
                new Date(startDate).getTime(),
                new Date(endDate).getTime()
            );
        }
    },[timeLine]);
    return(
        <>
        <div className="btn-group" role="group">
            <a className="btn" href="#" onClick={updateTimeLine} name="one_month">1M</a>
            <a className="btn btn-inactive" onClick={updateTimeLine} name="six_months">6M</a>
            <a className="btn" href="#" onClick={updateTimeLine} name="ytd">YTD</a>
            <a className="btn btn-inactive" onClick={updateTimeLine} name="one_year">1Y</a>
        </div>
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