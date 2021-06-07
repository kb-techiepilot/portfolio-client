import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import axios from 'axios';

import CandleBarChart from './CandleBarChart';

function InvestmentChart() {
    const { getAccessTokenSilently } = useAuth0();


    const [symbol, setSymbol] = useState();

    const [symbols, setSymbols] = useState({});
    const [loading, setLoading] = useState(true);

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
            onAutocomplete : function(sym) {
                setSymbol(sym);
                console.log("iiii" + symbol);
            }
        });
    });
    return(
        <div id="revenue-chart" className="card animate fadeUp">
            <div className="card-content">
                <div className="header mt-0 row">
                    <div className="col s8 input-field">
                        <i className="material-icons prefix">timeline</i>
                        <input type="text" id="autocomplete-input" className="autocomplete" />
                        <label for="autocomplete-input">Search for an Equity</label>
                    </div>
                </div>
                    <CandleBarChart symbol = {symbol} />
            </div>
        </div>
    )
}


export default InvestmentChart;