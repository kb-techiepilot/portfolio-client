import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import axios from 'axios';
import moment from "moment";

function InvestmentChart() {
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

    function GetSortOrder() {    
        return function(a, b) {    
            if (a.CH_TIMESTAMP > b.CH_TIMESTAMP) {    
                return 1;    
            } else if (a.CH_TIMESTAMP < b.CH_TIMESTAMP) {    
                return -1;    
            }    
            return 0;    
        }    
    }

    function getData(history) {
        var label = [];
        var value = [];
        var jsonObj = {};
        var jsonArray = [];
        history.forEach(ele => {
            ele.data.forEach(element => {
                // label.push(element.CH_TIMESTAMP);
                // value.push(element.CH_CLOSING_PRICE);
                jsonObj.CH_TIMESTAMP = element.CH_TIMESTAMP;
                jsonObj.CH_CLOSING_PRICE = element.CH_CLOSING_PRICE;
                jsonArray.push(jsonObj);
                jsonObj = {};
            })
        });
        jsonArray = jsonArray.sort(GetSortOrder());
        jsonArray.forEach(ele => {
            label.push(ele.CH_TIMESTAMP);
            value.push(ele.CH_CLOSING_PRICE);
        })
        const datasets = [];
        const dataObj = {};
        dataObj.data = value;
        dataObj.fill = false;
        dataObj.backgroundColor = "rgba(75,192,192,0.2)";
        dataObj.borderColor = "rgba(75,192,192,1)";
        dataObj.label = "";
        datasets.push(dataObj);

        const data = {};
        data.labels = label;
        data.datasets = datasets;
        return data;
    }

    return(
        <div id="revenue-chart" className="card animate fadeUp">
            <div className="card-content">
                <h5 className="header mt-0">
                    <div className="row">
                        <div className="col s10">
                            <div className="row">
                                <div className="input-field col s12">
                                <i className="material-icons prefix">timeline</i>
                                <input type="text" id="autocomplete-input" className="autocomplete" />
                                <label for="autocomplete-input">Search for an Equity</label>
                                </div>
                            </div>
                        </div>
                        {/* <a className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow right">Details</a> */}
                    </div>
                </h5>
                <div className="row">
                    <div className="col s12">
                        
                    { !loading ?
                        <Line data={getData(history)}/>
                        : <></> }
                    </div>
                </div>
            </div>
        </div>
    )
}


export default InvestmentChart;