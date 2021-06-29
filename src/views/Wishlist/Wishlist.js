import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from '../../components';
import M from 'materialize-css';

import config from '../../config';
import WishlistDetail from './WishlistDetail';

function Wishlist() {

    const { getAccessTokenSilently } = useAuth0();
    const [wishlists, setWishlists] = useState([]);
    const [token, setToken] = useState("");
    const [symbol, setSymbol] = useState("");
    const [loading, setLoading] = useState(true);   
    const [symbols, setSymbols] = useState({});

        useEffect(()=> {
        var elems = document.querySelectorAll('.share-autocomplete');
        M.Autocomplete.init(elems, {
            data : symbols,
            limit : 5,
            onAutocomplete : function(sym) {
                setSymbol(sym);
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

    useEffect(() => {
        async function fetchWishlist() {
            const token = await getAccessTokenSilently();
            setToken(token);
                axios
                .get(config.apiBaseUrl+"/api/v2/wishlist?workspace=default",{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }})
                .then(res => {
                    setLoading(false);
                    setWishlists(res.data.data);
                })
                .catch(err =>{
                console.log(err.message);
                });
        }
        fetchWishlist();

        const intervalId = setInterval(() => { 
            fetchWishlist();
        }, 2000 * 100);
        return () => clearInterval(intervalId);
    },[getAccessTokenSilently]);

    function openModal(event, symbol){
        console.log(symbol)
        setSymbol(symbol);
        event.preventDefault();

        var elems = document.querySelectorAll('#wishlist-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }

    function openAddModal(event) {
        event.preventDefault();

        var elems = document.querySelectorAll('#add-wishlist-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }

    async function deleteWishlist(event, id) {
        event.preventDefault();
        axios
        .delete(config.apiBaseUrl+"/api/v2/wishlist/"+id +"?workspace=default",{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            M.toast({html: '<span>Wishlist deleted &nbsp;</span><a href="/wishlist"> see all wishlists </a>'});
            setWishlists(res.data.data);
        })
        .catch(err =>{
            console.log(err.message);
        });
    }

    async function addWishlist(event) {
        event.preventDefault();
        axios
        .post(config.apiBaseUrl+"/api/v2/wishlist/", {
            symbol : symbol,
            workspace : 'default'
        },{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            M.toast({html: '<span>Wishlist deleted &nbsp;</span><a href="/wishlist"> see all wishlists </a>'});
            setWishlists(res.data.data);
        })
        .catch(err =>{
            console.log(err.message);
        });
    }

    return (
        <main>
            {loading ?
                <Loading />
            :
            <div>
                <div className="row">
                    <div className="content-wrapper-before blue-grey lighten-5"></div>
                    <div className="col s12">
                        <div className="container">
                            <section className="wishlist-wrapper section">

                            <div className="left mb-2">
                                <h4 className="blue-text">Wishlist</h4>
                            </div>
                            <div className="right mb-2">
                                <a className="gradient-45deg-purple-deep-orange gradient-shadow btn-floating pulse" href="#!" onClick={(event) => openAddModal(event)}><i className="material-icons">add</i></a>
                            </div>

                            <table className="highlight white responsive-table">
                            <thead>
                                <tr>
                                    <th style={{"width": "10%"}}>Symbol</th>
                                    <th style={{"width": "20%"}}>Company Name</th>
                                    <th style={{"width": "15%"}}>Index</th>
                                    <th style={{"width": "8%"}}>LTP</th>
                                    <th style={{"width": "8%"}}>Day Change</th>
                                    <th style={{"width": "8%"}}>% Change</th>
                                    <th className="flex-apart">
                                        <span>1Y Low</span>
                                        <span>1Y High</span>
                                    </th>
                                    <th style={{"width": "8"}}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {wishlists.map((wishlist, index) => 
                                <tr key={index}>
                                    <td>{wishlist.symbol}</td>  
                                    <td>{wishlist.company_name}</td>  
                                    <td>{wishlist.index}</td>
                                    <td>&#8377;{wishlist.current_price}</td>  
                                    <td className={wishlist.change > 0 ? "up" : "down"}>{wishlist.change}</td>  
                                    <td className={wishlist.change > 0 ? "up" : "down"}>
                                        {wishlist.percent_change}
                                        {wishlist.change > 0 ? 
                                            <i className="material-icons Small">arrow_drop_up</i>
                                        :
                                            <i className="material-icons Small">arrow_drop_down</i>
                                        }
                                    </td>  
                                    <td>
                                        <div className="flex-apart full-width">
                                            <span className="text-14">{wishlist.year_low}</span>
                                            <span className="text-14">{wishlist.year_high}</span>
                                        </div>
                                        <div className="mb4 slider-pos relative full-width">
                                            <span className="year-slider" style={{"left" : ((wishlist.current_price - wishlist.year_low) * 100 / (wishlist.year_high - wishlist.year_low) ) + "%"}}>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="center">
                                        <a className="wishlist-actions" href="#!" onClick={(event) => openModal(event, wishlist.symbol)}><i className="material-icons">remove_red_eye</i></a>
                                        <a href="#!" className="wishlist-actions"><i className="material-icons" onClick={(event) => deleteWishlist(event, wishlist.wishlist_id)}>delete</i></a>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                            </section>
                        </div>
                    </div>
                </div>
                <div id="wishlist-modal" className="modal">
                    <div className="modal-content">
                        <WishlistDetail symbol={symbol}/>
                    </div>
                </div>
                <div id="add-wishlist-modal" className="modal">
                    <div className="modal-content">
                        <div className="header mt-0 row">
                            <div className="col s12 m12 input-field">
                                <div className="col s8">
                                    <i className="material-icons prefix hide-on-med-and-down">search</i>
                                    <input type="text" id="share-symbol" className="share-autocomplete" autoComplete="new-password" placeholder="Search for an Equity"/>
                                </div>
                                <div className="col s4">
                                    <button className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow" onClick={(event) => addWishlist(event)}>
                                        Add
                                    </button>
                                    {/* <button className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow">
                                        Delete
                                    </button> */}
                                </div>
                            </div>
                        </div>
                        <WishlistDetail symbol={symbol}/>
                    </div>
                </div>
            </div>
            }
        </main>
    )
}

export default Wishlist;