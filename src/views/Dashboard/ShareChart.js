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

    const [timeLine, setTimeLine] = useState("one_day");

    useEffect(async () => {
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
                    <div className="col s12 m10 input-field">
                        <i className="material-icons prefix">timeline</i>
                        <input type="text" id="autocomplete-input" className="autocomplete" />
                        <label htmlFor="autocomplete-input">Search for an Equity</label>
                    </div>
                    <div className="btn-group col s12 m3" role="group">
                        <a className="btn" href="#" onClick={updateTimeLine} name="one_day">1D</a>
                        <a className="btn btn-inactive" href="#" onClick={updateTimeLine} name="five_days">5D</a>
                        <a className="btn" href="#" onClick={updateTimeLine} name="one_month">1M</a>
                        <a className="btn btn-inactive" onClick={updateTimeLine} name="six_months">6M</a>
                        <a className="btn" href="#" onClick={updateTimeLine} name="ytd">YTD</a>
                        <a className="btn btn-inactive" onClick={updateTimeLine} name="one_year">1Y</a>
                    </div>
                </div>
                {timeLine === 'one_day'
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