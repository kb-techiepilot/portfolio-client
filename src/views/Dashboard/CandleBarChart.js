import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import axios from 'axios';
import moment from "moment";
import Chart from "react-apexcharts";

function CandleBarChart() {
    const { getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);

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
    
    async function getHistoryData(symbol) {
        console.log("inside getHistoryData " + symbol);
        let endDate = moment().format("YYYY-MM-DD");
        const startDate = moment().subtract(1, 'year').format("YYYY-MM-DD");
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
        height: '10%'
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
        <h4 className="header mt-0">
            <div className="input-field">
            <i className="material-icons prefix">timeline</i>
            <input type="text" id="autocomplete-input" className="autocomplete" />
            <label for="autocomplete-input">Search for an Equity</label>
            </div>
        </h4>
        <div className="row">
        <div className="mixed-chart">
            <Chart
              options={options}
              series={getData(history)}
              type="candlestick"
              width="100%"
              height="100%"
            />
          </div>
        </div>
    </div>
</div>
    )
}


export default CandleBarChart;