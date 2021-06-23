import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import 'material-icons/iconfont/material-icons.css';

import '../assets/css/navbar.css';

import config from '../config';

import LineChart from '../views/ChartsV2/LineChart';


function Navbar() {
    const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
    const [pageName, setPageName] = useState("Dashboard");

    useEffect(()=> {
        var elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems, {
            closeOnClick: true,
            draggable: true
        });
    });

    const [symbol, setSymbol] = useState("SBIN");
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

        elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});

        M.updateTextFields();

        elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
    });

    useEffect(() => {
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
        document.getElementById('modal');
    },[symbol]);    

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

    function updatePage(event) {
        event.preventDefault();
        setPageName(event.target.name);
    }

    const callSecureAPI = async() => {
        try {
          const token = await getAccessTokenSilently();
          console.log(token);
  
        } catch(error) {
          console.log(error);
        }
    };

    return (
        <div>
            <header>
                <nav>
                    <div className="nav-wrapper">
                        <div className="row">
                            <div className="col s12">
                                <a href="#!" data-target="sidenav-1" className="brand-logo darken-1 left sidenav-trigger hide-on-medium-and-up"><img src={process.env.PUBLIC_URL + '../../images/logo.png'} alt="" />
                                    {/* <span className="logo-text header-text">  PortfolioTracker</span> */}
                                </a>
                                
                                <div className="header mt-0 row">
                                    <div className="col s12 m12 input-field">
                                        <div className="col s8">
                                            <i className="material-icons prefix hide-on-med-and-down">search</i>
                                            <input type="text" id="share-symbol" className="share-autocomplete" autoComplete="new-password" placeholder="Search for an Equity"/>
                                            {/* <label htmlFor="share-symbol">Search for an Equity</label> */}
                                        </div>
                                        <div className="col s4">
                                            <button data-target="modal" className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow modal-trigger">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>


            <ul id="sidenav-1" className="sidenav sidenav-fixed sidenav-dark">
            <h5 className="logo-wrapper" style={{
                fontFamily: "monospace"
              }}>
                <a className="brand-logo darken-1" href="/dashboard">
                    <img className="hide-on-med-and-down " src={process.env.PUBLIC_URL + '../../images/logo.png'} alt="logo"/>
                    <span className="logo-text header-text hide-on-med-and-down">  PortfolioTracker
                    </span>
                </a>
            </h5>
                <li><a href="/" className={pageName === 'Dashboard' ? "active" : "" } onClick={(event) => updatePage(event)} name="Dashboard">Dashboard</a></li>
                <li><a href="/holdings" className={pageName === 'Holdings' ? "active" : "" } onClick={(event) => updatePage(event)} name="Holdings">Holdings</a></li>
                <li><a href="/wishlist" className={pageName === 'Wishlist' ? "active" : "" } onClick={(event) => updatePage(event)} name="Wishlist">Wishlist</a></li>
                <li><a href="/transaction" className={pageName === 'Transactions' ? "active" : "" } onClick={(event) => updatePage(event)} name="Transactions">Transactions</a></li>
                <li><a href="#!" onClick={ () => callSecureAPI() } name="token">Print Token</a></li>
                {isAuthenticated ? 
                <>
                    <li><a href="/profile" className={pageName === 'Profile' ? "active" : "" } onClick={(event) => updatePage(event)} name="Profile">
                    Profile</a></li>
                    <li><a href="#!" onClick={ () => logout() }>
                    Logout</a></li>
                </>
                :
                <li><a href="#!" onClick={ () => loginWithRedirect() }>
                    Login</a></li>
                }
            </ul>

            <main>
                <div id="modal" className="modal" style={{display: "block"}}>
                    <div className="modal-content">
                        <LineChart symbol = {symbol}/>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default Navbar;