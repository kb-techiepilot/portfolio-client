import React, {useEffect} from 'react';
import M from 'materialize-css';
import axios from 'axios';
import Listing from './Listing';

import config from '../../../config';
function Gainers() {

    useEffect(()=> {
        var elems = document.querySelectorAll('.tabs');
        M.Tabs.init(elems, {
            swipeable: true
        });
    });

    useEffect(() => {
        axios
        .get(config.apiBaseUrl+"/api/v2/indexes/")
        .then(res => {
            
        })
        .catch(err =>{
          console.log(err.message);
        });
    },[]);

    return(
        <>
        <div className="card-content">
          <span className="card-title">Top Gainers/Losers </span>
            <ul id="tabs" className="tabs">
                <li className="tab col s6"><a className="active" href="#swipe-1">Nifty 50</a></li>
                <li className="tab col s6"><a href="#swipe-2">Bank Nifty</a></li>
            </ul>
            <div id="swipe-1" className="col s12">
                <Listing url = "/api/v2/nse/gainers/nifty" />
            </div>
            <div id="swipe-2" className="col s12">
                <Listing url= "/api/v2/nse/gainers/bank" />
            </div>
        </div>
        </>
    )
};

export default Gainers;