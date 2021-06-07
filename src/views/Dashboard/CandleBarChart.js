import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import axios from 'axios';
import moment from "moment";
import Chart, {exec} from "react-apexcharts";

function CandleBarChart() {
    const { getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);

    const [symbol, setSymbol] = useState("SBIN");
    const [symbols, setSymbols] = useState({});
    const [history, setHistory] = useState([]);

    useEffect(async () => {
        const token = await getAccessTokenSilently();
        axios
        .get("https://kb-shares.azurewebsites.net/api/v1/symbols", {
            headers: {
              Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            var symbolsJson = {};
            res.data.forEach((data) => {
                symbolsJson[data] = null;
            });
            setSymbols(symbolsJson);
          setLoading(false);
        })
        .catch(err =>{
          console.log(err.message);
        });
    },[]);


    useEffect(()=> {
        var elems = document.querySelectorAll('.autocomplete');
        M.Autocomplete.init(elems, {
            data : symbols,
            limit : 5,
            onAutocomplete : function(symbol) {
                getHistoryData(symbol);
            }
        });
    });
    
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
        text: 'CandleStick Chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
      };

    return(

<div id="revenue-chart" className="card animate fadeUp">
    <div className="card-content">
        <div className="header mt-0 row">
            <div className="col s9 input-field">
                <i className="material-icons prefix">timeline</i>
                <input type="text" id="autocomplete-input" className="autocomplete" />
                <label for="autocomplete-input">Search for an Equity</label>
            </div>
            <div class=" col s3 toolbar">
                    <button id="one_month"
                        onClick={ () => { getHistoryData('one_month')}}
                    >
                        1M
                    </button>
                    &nbsp;
                    <button id="six_months"
                    onClick={ () => { getHistoryData('six_months')}}
                        >
                    6M
                    </button>
                    &nbsp;
                    <button id="ytd"
                    onClick={ () => { getHistoryData('ytd')}}
            
                    >
                        YTD
                    </button>
                    &nbsp;
                    <button id="one_year"
                    onClick={ () => { getHistoryData('one_year')}}
            
                    >
                        1Y
                    </button>
                </div>
        </div>
        <div className="row">
            <div id="chart">
                <div id="chart-timeline">
                    <Chart options={options}
                        series={getData(history)}
                        type="candlestick" height={350} />
                </div>
            </div>
        </div>
    </div>
</div>
    )
}


export default CandleBarChart;