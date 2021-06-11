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


    useEffect(()=> {
        var elems = document.querySelectorAll('.autocomplete');
        M.Autocomplete.init(elems, {
            data : symbols,
            limit : 5,
            onAutocomplete : function(sym) {
                setSymbol(sym);
            }
        });

        elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});

        M.updateTextFields();
    });

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

    function updateTimeLine(event) {
        event.preventDefault();
        setSymbol(symbol);
        setTimeLine(event.target.value);
    }

    return(
            <div className="card-content">
                <div className="header mt-0 row">
                    <div className="col s12 m12 input-field">
                        <i className="material-icons prefix">timeline</i>
                        <input type="text" id="autocomplete-input1" className="autocomplete" />
                        <label htmlFor="autocomplete-input1">Search for an Equity</label>
                    </div>
                    {/* <div className="btn-group col s12 m6" role="group">
                        <div class="input-field col s12">
                            <select onChange={updateTimeLine}>
                                <option value="line_chart">Line</option>
                                <option value="candle_stick">Candlestick</option>
                            </select>
                            <label>Chart Type</label>
                        </div>
                    </div> */}
                </div>
                {timeLine === 'line_chart'
                ?
                <LineChart symbol = {symbol}/>
                :
                <CandleBarChart symbol = {symbol} timeLine = {timeLine} />
                }
            </div>
    )
}

export default ShareChart;