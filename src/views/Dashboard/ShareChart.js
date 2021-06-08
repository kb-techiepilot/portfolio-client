import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import axios from 'axios';

import CandleBarChart from './CandleBarChart';

import '../../../src/assets/css/btn-group.css';

import config from '../../config';

function ShareChart() {
    const { getAccessTokenSilently } = useAuth0();


    const [symbol, setSymbol] = useState("SBIN");

    const [symbols, setSymbols] = useState({});

    const [timeLine, setTimeLine] = useState();

    useEffect(async () => {
        const token = await getAccessTokenSilently();
        axios
        .get(config.apiBaseUrl+"/api/v1/symbols", {
            headers: {
              Authorization: `Bearer ${token}`,
            }})
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
                    <div className="col s12 m8 input-field">
                        <i className="material-icons prefix">timeline</i>
                        <input type="text" id="autocomplete-input" className="autocomplete" />
                        <label for="autocomplete-input">Search for an Equity</label>
                    </div>

                    <div class="btn-group col s12 m4" role="group">
                        <a class="btn btn-inactive" href="#" onClick={updateTimeLine} name="one_month">1M</a>
                        <a class="btn" href="#" onClick={updateTimeLine} name="six_months">6M</a>
                        <a class="btn btn-inactive" onClick={updateTimeLine} name="ytd">YTD</a>
                        <a class="btn" href="#" onClick={updateTimeLine} name="one_year">1Y</a>
                    </div>
                </div>
                    <CandleBarChart symbol = {symbol} timeLine = {timeLine} />
            </div>
        </div>
    )
}

export default ShareChart;