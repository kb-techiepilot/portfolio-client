import React, {useState, useEffect} from 'react';
import axios from 'axios';
import M from 'materialize-css';

import config from '../../config';

import ShareDetail from './ShareDetail';

function ShareSearch(props){


    const [symbols, setSymbols] = useState({});

    const [wishSymbol, setWishSymbol] = useState(props.symbol);

    const [random, setRandom] = useState(0);

    useEffect(()=> {
        var elems = document.querySelectorAll('.wishlist-autocomplete');
        M.Autocomplete.init(elems, {
            data : symbols,
            limit : 5,
            onAutocomplete : function(sym) {
                setRandom(Math.random());
                setWishSymbol(sym);
            }
        });
    
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

    return(
        <div className="modal-content">
            <div className="header mt-0 row">
                <div className="col s12 m12 input-field">
                    <div className="col s12">
                        <i className="material-icons prefix hide-on-med-and-down">search</i>
                        <input type="text" id="share-symbol" className="wishlist-autocomplete" autoComplete="new-password" placeholder="Search for an Equity"/>
                    </div>
                </div>
            </div>
            <ShareDetail symbol={wishSymbol} random={random}/>
        </div>
    )
};

export default ShareSearch;