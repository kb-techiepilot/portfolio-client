import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import moment from "moment";
import Chart from "react-apexcharts";

import Loading from '../../components/Loading';
import config from '../../config';

function CandleBarChart(props) {
    const { getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);


    useEffect(async () => {
        // setLoading(true);
        const token = await getAccessTokenSilently();

        var startDate;
        var endDate = moment().format("YYYY-MM-DD");
        if(props.timeLine === 'one_month') {
            startDate = moment().subtract(1, 'month').format("YYYY-MM-DD");
        }else if(props.timeLine === 'six_months') {
            startDate = moment().subtract(6, 'month').format("YYYY-MM-DD");
        }else if(props.timeLine === 'ytd') {
            startDate = moment().year() + "-01-01";
            console.log(startDate);
        }else {
            startDate = moment().subtract(1, 'year').format("YYYY-MM-DD");
        }

        axios
        .get(config.apiBaseUrl+"/api/v1/history/" + props.symbol, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
    },[props.symbol, props.timeLine]);
    

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
      };
    return(
        <>
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