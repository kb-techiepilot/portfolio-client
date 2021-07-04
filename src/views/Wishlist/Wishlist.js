import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import { BarLoader } from 'react-spinners';
import { css } from '@emotion/react';

import config from '../../config';
import WishlistDetail from './WishlistDetail';

import LineChart from '../ChartsV2/LineChart';
import ListingSekelton from './ListingSkeleton';

function Wishlist() {

    const { getAccessTokenSilently } = useAuth0();
    const [wishlists, setWishlists] = useState([]);
    const [token, setToken] = useState("");
    const [symbol, setSymbol] = useState("");
    const [loading, setLoading] = useState(true);   
    const [symbols, setSymbols] = useState({});
    const [preloader, setPreloader] = useState(false);

    const [chartSymbol, setChartSymbol] = useState("");
    const [wishSymbol, setWishSymbol] = useState("");

    const override = css`
        display: block;
    `;

    useEffect(()=> {
        var elems = document.querySelectorAll('.wishlist-autocomplete');
        M.Autocomplete.init(elems, {
            data : symbols,
            limit : 5,
            onAutocomplete : function(sym) {
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

    useEffect(() => {
        async function fetchWishlist() {
            const token = await getAccessTokenSilently();
            setToken(token);
                axios
                .get(config.apiBaseUrl+"/api/v2/wishlist?workspace=default",{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }},{ validateStatus: false })
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
        }, 2000);
        return () => clearInterval(intervalId);
    },[getAccessTokenSilently]);

    function openModal(event, symbol){
        console.log(symbol)
        setSymbol(symbol);
        
        var elems = document.querySelectorAll('#wishlist-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
        event.preventDefault();
    }

    function openChart(event, symbol){
        console.log(symbol)
        setChartSymbol(symbol);
        event.preventDefault();

        var elems = document.querySelectorAll('#chart-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }

    function openAddModal(event) {
        event.preventDefault();
        setSymbol("");
        var elems = document.querySelectorAll('#add-wishlist-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }

    async function deleteWishlist(event, id) {
        setPreloader(true);
        event.preventDefault();
        axios
        .delete(config.apiBaseUrl+"/api/v2/wishlist/"+id +"?workspace=default",{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            setPreloader(false);
            M.toast({html: 'Wishlist deleted !'},{
                displayLength: 4000
            });
            setWishlists(res.data.data);
        })
        .catch(err =>{
            setPreloader(false)
            console.log(err.response);
            M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    async function addWishlist(event) {
        setPreloader(true);
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
            M.toast({html: 'Wishlist added !'},{
                displayLength: 4000
            });
            setWishlists(res.data.data);
            setPreloader(false)
        })
        .catch(err =>{
            setPreloader(false)
            console.log(err.response);
            M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    return (
        <main>
            
            <BarLoader loading={preloader} css={override} width={"100%"} />
            {loading ?
                <ListingSekelton/>
            :
            <div>
                <div className="row">
                {wishlists.length > 0 ? <>
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
                                            <th style={{"width": "25%"}}>Stock</th>
                                            <th style={{"width": "15%"}}>Index</th>
                                            <th style={{"width": "12%"}}>LTP</th>
                                            <th style={{"width": "12%"}}>Day Change</th>
                                            <th style={{"width": "12%"}}>% Change</th>
                                            <th className="flex-apart">
                                                <span>1Y Low</span>
                                                <span>1Y High</span>
                                            </th>
                                            <th className="revert" style={{"width": "8%"}}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {wishlists.map((wishlist, index) => 
                                        <tr key={index}>
                                            <td>
                                                <div>
                                                    <span className="holdings-name text-15 font-medium">{wishlist.company_name}</span>
                                                    <div className="display-flex">
                                                        <div className="holdings-symbol">{wishlist.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
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
                                                <a className="wishlist-actions" href="#!" onClick={(event) => openChart(event, wishlist.symbol)}><i className="material-icons">show_chart</i></a>
                                                <a className="wishlist-actions" href="#!" onClick={(event) => openModal(event, wishlist.symbol)}><i className="material-icons">remove_red_eye</i></a>
                                                <a href="#!" className="wishlist-actions"><i className="material-icons" onClick={(event) => deleteWishlist(event, wishlist.wishlist_id)}>delete</i></a>
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    </div></>
                        :
                    <div className="center mt-10">
                        <img src={process.env.PUBLIC_URL + '../../images/empty-dish.png'} alt="" style={{"height" : "100px"}}/>
                        <h5>
                            You haven't added any Stock to your wishlist, use the search bar or clieck below to add Wishlist
                        </h5>
                        <button className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow" onClick={(event) => openAddModal(event)}>
                            Add Wishlist
                        </button>
                    </div>
                    }
                </div>
                <div id="wishlist-modal" className="modal">
                    <div className="modal-content">
                        <WishlistDetail symbol={symbol}/>
                    </div>
                </div>
                <div id="add-wishlist-modal" className="modal">
                    <div className="modal-content">
                        <div className="header mt-0 row">
                            <BarLoader loading={preloader} css={override} width={"100%"} />
                            <div className="col s12 m12 input-field">
                                <div className="col s8">
                                    <i className="material-icons prefix hide-on-med-and-down">search</i>
                                    <input type="text" id="share-symbol" className="wishlist-autocomplete" autoComplete="new-password" placeholder="Search for an Equity"/>
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
                        <WishlistDetail symbol={wishSymbol}/>
                    </div>
                </div>

                <div id="chart-modal" className="modal eq-modal">
                    <div className="modal-content">
                        <LineChart symbol={chartSymbol}/>
                    </div>
                </div>
            </div>
            }
        </main>
    )
}

export default Wishlist;