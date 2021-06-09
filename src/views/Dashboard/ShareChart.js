import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import axios from 'axios';

import CandleBarChart from './CandleBarChart';
import LineChart from './LineChart';

import '../../../src/assets/css/btn-group.css';

import config from '../../config';

function ShareChart() {


    const [symbol, setSymbol] = useState("SBIN");

    const [symbols, setSymbols] = useState({});

    const [timeLine, setTimeLine] = useState("line_chart");

    useEffect(() => {
        axios
        .get(config.apiBaseUrl+"/api/v1/symbols")
        .then(res => {
            var symbolsJson = {};
            res.data.forEach((data) => {
                symbolsJson[data] = null;
            });
            setSymbols(symbolsJson);
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
            onAutocomplete : function(sym) {
                setSymbol(sym);
            }
        });

        elems = document.querySelectorAll('.tabs');
        M.Tabs.init(elems, {});
    });

    function updateTimeLine(event) {
        event.preventDefault();
        setSymbol(symbol);
        setTimeLine(event.target.name);
    }

    return(
        <div id="revenue-chart" className="card animate fadeUp">
            <div className="card-content">
                <div className="header mt-0 row">
                    <div className="col s12 m6 input-field">
                        <i className="material-icons prefix">timeline</i>
                        <input type="text" id="autocomplete-input" className="autocomplete" />
                        <label htmlFor="autocomplete-input">Search for an Equity</label>
                    </div>
                    <div className="btn-group col s12 m6" role="group">
                        <ul className="tabs tabs-fixed-width tab-demo z-depth-1">
                            <li className="tab"><a className="active" href="#" onClick={updateTimeLine} name="line_chart">Line Chart</a></li>
                            <li className="tab"><a href="#" onClick={updateTimeLine} name="candle_stick">Candlestick Chart</a></li>
                        </ul>
                    </div>
                </div>
                {timeLine === 'line_chart'
                ?
                <LineChart symbol = {symbol}/>
                :
                <CandleBarChart symbol = {symbol} timeLine = {timeLine} />
                }
            </div>
        </div>
    )
}

export default ShareChart;