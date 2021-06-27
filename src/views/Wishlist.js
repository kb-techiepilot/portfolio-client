import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from '../components';
import M from 'materialize-css';

import config from '../config';

function Wishlist() {

    const { getAccessTokenSilently } = useAuth0();
    const [wishlists, setWishlists] = useState([]);
    const [wishlistDetail, setWishlistDetail] = useState([]);
    const [token, setToken] = useState("");
    const [symbol, setSymbol] = useState("");
    const [loading, setLoading] = useState(true);    
    
    useEffect(()=> {
        console.log("open");
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
    },[]);

    useEffect(() => {
        console.log('all');
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
    },[getAccessTokenSilently]);

    useEffect(() => {
        
        console.log('single');
        async function fetchWishlist() {
            if(symbol !== "") {
                const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/wishlist/"+ symbol +"?workspace=default",{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }})
                .then(res => {
                    setLoading(false);
                    setWishlistDetail(res.data);
                })
                .catch(err =>{
                console.log(err.message);
                });
            }
        }
        fetchWishlist();
    },[symbol, getAccessTokenSilently]);

    function openModal(event, symbol){
        console.log(symbol)
        setSymbol(symbol);
        event.preventDefault();
    }

    async function handleWishlist(event, id) {
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

    return (
        <main>
            {loading ?
                <Loading />
            :
                <div className="card animate fadeUp">
                    <div className="card-content">
                        <span className="card-title">Wishlist</span>
                        <table className="highlight responsive-table">
                            <thead>
                                <tr>
                                    <th style={{"width": "10"}}>Symbol</th>
                                    <th style={{"width": "20"}}>Company Name</th>
                                    <th style={{"width": "15"}}>Index</th>
                                    <th style={{"width": "8"}}>LTP</th>
                                    <th style={{"width": "8"}}>Day Change</th>
                                    <th style={{"width": "8"}}>% Change</th>
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
                                            <span className="year-slider" style={{"left" : ((wishlist.current_price - wishlist.year_low) * 100 / (wishlist.year_high - wishlist.year_low) )}}>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="center">
                                        <a className="wishlist-actions modal-trigger" href="#wishlist-modal" onClick={(event) => openModal(event, wishlist.symbol)} ><i className="material-icons">remove_red_eye</i></a>
                                        <a href="#!" className="wishlist-actions"><i className="material-icons" onClick={(event) => handleWishlist(event, wishlist.wishlist_id)}>delete</i></a>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                        <div id="wishlist-modal" className="modal">
                            <div className="modal-content">
                                <h4>{wishlistDetail.symbol}</h4>
                                <p>A bunch of text</p>
                            </div>
                            <div className="modal-footer">
                                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </main>
    )
}

export default Wishlist;