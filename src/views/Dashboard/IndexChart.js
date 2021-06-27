import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import axios from 'axios';
import Loading from '../../components/Loading';

import IntraDayChart from '../ChartsV2/IntraDayChart';
import NumberFormat from '../../util/NumberFormat';

import config from '../../config';

function IndexChart(){
    const [indexSymbols, setIndexSymbols] = useState([]);
    const [indexList, setIndexList] = useState("NIFTY 50");
    const [selectedIndex, setSelectedIndex] = useState("NIFTY 50");

    const [selectedIndexDetails, setSelectedIndexDetails] = useState({});

    const [intraDay, setIntraDay] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        var elems = document.querySelectorAll('.autocomplete');
        M.Autocomplete.init(elems, {
            data : indexList,
            limit : 5,
            onAutocomplete : function(sym) {
                setSelectedIndex(sym);
            }
        });
    });

    useEffect(() => {
        axios
        .get(config.apiBaseUrl+"/api/v2/indexes/")
        .then(res => {
            var symbolsJson = {};
            res.data.data.forEach((data) => {
                symbolsJson[data.indexSymbol] = null;
            });
            setIndexList(symbolsJson);
            setIndexSymbols(res.data);
        })
        .catch(err =>{
          console.log(err.message);
        });
    },[]);

    useEffect(() => {
        axios
        .get(config.apiBaseUrl+"/api/v2/indexes/intraday/" + selectedIndex)
        .then(res => {
            indexSymbols.data.forEach(data => {
                if(data.indexSymbol === selectedIndex){
                    setSelectedIndexDetails(data);
                }
            })
            setIntraDay(res.data);
            setLoading(false);
            })
        .catch(err =>{
            console.log(err.message);
        });
    },[indexSymbols.data, selectedIndex, selectedIndexDetails]);

    return(
        <>
        <div className="card-content">
            <div className="header mt-0 row">
                <div className="col s12 m12 input-field">
                    <i className="material-icons prefix">timeline</i>
                    <input type="text" id="autocomplete-input2" className="autocomplete"/>
                    <label htmlFor="autocomplete-input2">Search for an Index</label>
                </div>
            </div>
            {
                loading ? <Loading /> : <></>
            }
            {(intraDay.intra !== undefined && selectedIndexDetails !== undefined) &&
            <div>
                <ul className="index-header">
                    <li className="tbVal">
                        <span className="val">{NumberFormat(selectedIndexDetails.last)}</span>
                        <span className="arrow-down-red"></span><br/>
                        <span className={selectedIndexDetails.variation > 0 ? "value-per up" : "value-per down"}>
                            {selectedIndexDetails.variation} ({selectedIndexDetails.percentChange}%)
                        </span>
                    </li>
                    <li className="open"> <span>Open</span><br/>
                        <span className="open-val">{NumberFormat(selectedIndexDetails.open)}</span>
                    </li>
                    <li className="high"> <span>High</span><br/>
                        <span className="open-val up">{NumberFormat(selectedIndexDetails.high)}</span>
                    </li>
                    <li className="low"> <span>Low</span><br/>
                        <span className="open-val down">{NumberFormat(selectedIndexDetails.low)}</span>
                    </li>
                    {/* <li className="prevclose"> <span>Prev. Close</span><br/>
                        <span>15,772.75</span>
                    </li> */}
                </ul>
                <IntraDayChart chartId="indexChart" symbol={selectedIndex} history={intraDay} previousClose={selectedIndexDetails.previousClose} lastPrice={selectedIndexDetails.last} />
            </div>
            }
        </div>
        </>
    )
}

export default IndexChart;