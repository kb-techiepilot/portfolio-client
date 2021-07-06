import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
// import { BarLoader } from 'react-spinners';
// import { css } from '@emotion/react';

import config from '../../config';

import ShareDetail from './ShareDetail';

function ShareSearch(props){


    // const { getAccessTokenSilently } = useAuth0(); 
    const [symbols, setSymbols] = useState({});
    // const [loader, setLoader] = useState(false);

    const [wishSymbol, setWishSymbol] = useState(props.symbol);

    const [random, setRandom] = useState(0);
    // const override = css`
    //     display: block;
    // `;

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


    // async function addWishlist(event) {
    //     setLoader(true);
    //     event.preventDefault();
    //     const token = await getAccessTokenSilently();
    //     axios
    //     .post(config.apiBaseUrl+"/api/v2/wishlist/", {
    //         symbol : wishSymbol,
    //         workspace : 'default'
    //     },{
    //         headers: {
    //         Authorization: `Bearer ${token}`,
    //         }})
    //     .then(res => {
    //         M.toast({html: 'Wishlist added !'},{
    //             displayLength: 4000
    //         });
    //         // setWishlists(res.data.data);
    //         setLoader(false)
    //     })
    //     .catch(err =>{
    //         setLoader(false)
    //         err.response.data && M.toast({html: ''+err.response.data.message},{
    //             displayLength: 4000
    //         });
    //     });
    // }

    return(
        <div className="modal-content">
            <div className="header mt-0 row">
                {/* <BarLoader loading={loader} css={override} width={"100%"} /> */}
                <div className="col s12 m12 input-field">
                    <div className="col s8">
                        <i className="material-icons prefix hide-on-med-and-down">search</i>
                        <input type="text" id="share-symbol" className="wishlist-autocomplete" autoComplete="new-password" placeholder="Search for an Equity"/>
                    </div>
                    <div className="col s4">
                        {/* <button className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow" onClick={(event) => addWishlist(event)}>
                            Add
                        </button>
                        <button className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow">
                            Delete
                        </button> */}
                    </div>
                </div>
            </div>
            <ShareDetail symbol={wishSymbol} random={random}/>
        </div>
    )
};

export default ShareSearch;