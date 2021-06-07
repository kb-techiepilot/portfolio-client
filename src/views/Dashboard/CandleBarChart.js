import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import moment from "moment";
import Chart from "react-apexcharts";

function CandleBarChart(props) {
    console.log(props);
    const { getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);
    const [symbol, setSymbol] = useState(props.symbol);
    const [history, setHistory] = useState([]);


    useEffect(async () => {
        const token = await getAccessTokenSilently();
        var startDate = moment().subtract(1, 'year').format("YYYY-MM-DD");
        var endDate = moment().format("YYYY-MM-DD");
        axios
        .get("https://kb-shares.azurewebsites.net/api/v1/history/" + props.symbol, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
                'start': startDate,
                'end': endDate
            }})
        .then(res => {
            setHistory(res.data);
            })
        .catch(err =>{
          console.log(err.message);
        });
    },[props.symbol]);
    
    async function getHistoryData(timeLine) {
        console.log("inside getHistoryData " + timeLine);
        var startDate;
        var endDate = moment().format("YYYY-MM-DD");
        if(timeLine === 'one_month') {
            startDate = moment().subtract(1, 'month').format("YYYY-MM-DD");
        }else if(timeLine === 'six_months') {
            startDate = moment().subtract(6, 'month').format("YYYY-MM-DD");
        }else if(timeLine === 'ytd') {
            startDate = moment().year() + "-01-01";
            console.log(startDate);
        }else {
            startDate = moment().subtract(1, 'year').format("YYYY-MM-DD");
        }
        const token = await getAccessTokenSilently();
        
        axios
        .get("https://kb-shares.azurewebsites.net/api/v1/history/"+symbol,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                'start': startDate,
                'end': endDate
            }
        })
        .then(res => {
            var data = res.data;
            setHistory(data);
            setLoading(false);
        })
        .catch(err =>{
            console.log(err.message);
        });
    }

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
      title: {
        text: props.symbol,
        align: 'left'
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
        <div className="row">
            <div id="chart">
                <div id="chart-timeline">
                    <Chart options={options}
                        series={getData(history)}
                        type="candlestick" height={350} />
                </div>
            </div>
        </div>
    )
}


export default CandleBarChart;