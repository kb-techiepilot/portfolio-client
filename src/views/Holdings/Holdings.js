import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import { BarLoader } from 'react-spinners';
import { css } from '@emotion/react';

import LineChart from '../ChartsV2/LineChart';
import NumberFormat from '../../util/NumberFormat';

import config from '../../config';

import ShareSearch from '../Share/ShareSearch';
import SummaryCards from '../Dashboard/SummaryCards';

function Holdings(){
    const { getAccessTokenSilently } = useAuth0(); 

    const [holdings, setHoldings] = useState([]);
    const [chartSymbol, setChartSymbol] = useState("");
    const [preload, setPreload] = useState(true);

    const override = css`
        display: block;
    `;

    useEffect(() => {
        async function fetchWishlist() {
            const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/holdings?workspace=default",{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }},{ validateStatus: false })
                .then(res => {
                    setHoldings(res.data.data);
                    setPreload(false);
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

        var elems = document.querySelectorAll('#add-holdings-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }
    return(
        <main>
            <BarLoader loading={preload} css={override} width={"100%"} />
            <div>
                <div className="row">
                {holdings.length > 0 ?<>
                <div className="hide-on-med-and-down" >
                    <SummaryCards/>
                </div>
                    <div className="content-wrapper-before blue-grey lighten-5"></div>
                    <div className="col s12">
                        <div className="container">
                            <section className="wishlist-wrapper section">

                                <div className="left mb-2">
                                    <h4 className="blue-text">Holdings</h4>
                                </div>
                                <div className="right mb-2">
                                    <a className="gradient-45deg-purple-deep-orange gradient-shadow btn-floating pulse" href="#!" onClick={(event) => openAddModal(event)}><i className="material-icons">add</i></a>
                                </div>
                                <table className="highlight white responsive-table">
                                    <thead>
                                        <tr>
                                            <th>Stock</th>
                                            <th>Net Qty.</th>
                                            <th>Avg. Price</th>
                                            <th>Invested Amt.</th>
                                            <th>Current Value</th>
                                            <th>Day P&L</th>
                                            <th>Day %</th>
                                            <th>Overall P&L</th>
                                            <th>Overall %</th>
                                            <th className="revert" style={{"width": "8%"}}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {holdings.map((holding, index) => 
                                        <tr key={holding.holdings_id}>
                                            <td>
                                                <div>
                                                    <span className="holdings-name text-15 font-medium">{holding.company_name}</span>
                                                    <div className="display-flex">
                                                        <div className="holdings-symbol">{holding.symbol}</div>
                                                        <div className="holdings-ltp"> 
                                                            <span>LTP:</span>
                                                            <span>{holding.current_price}</span>
                                                            <span className={holding.day_percent > 0 ? "up" : "down"}>
                                                                ({holding.day_percent}%)
                                                            </span>
                                                            </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{holding.quantity}</td>  
                                            <td>{NumberFormat(holding.price)}</td>
                                            <td>{NumberFormat(holding.invested_value)}</td>
                                            <td>{NumberFormat(holding.current_value)}</td>
                                            <td>{NumberFormat(holding.day_pl)}</td>  
                                            <td>{holding.day_percent}</td>  
                                            <td>{NumberFormat(holding.overall_pl)}</td>  
                                            <td>{holding.overall_percent}</td>  
                                            
                                            <td className="center">
                                                <div className="action-ul">
                                                    <ul>
                                                        <li>
                                                            <a className="wishlist-actions" href="#!" onClick={(event) => openChart(event, holding.symbol)}>
                                                                <i className="material-icons">show_chart</i>
                                                            </a>
                                                        </li>
                                                        {/* <li>
                                                            <a className="wishlist-actions" href="#!" onClick={(event) => openAddModal(event)}><span className="chip lighten-5 green green-text">B</span></a>
                                                        </li>
                                                        <li>
                                                            <a href="#!" className="wishlist-actions"><span className="chip lighten-5 orange orange-text">S</span></a>
                                                        </li> */}
                                                    </ul>
                                                </div>
                                                
                                                
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
                            You haven't added any Stock to your account, use the search bar or clieck below to add Holdings
                        </h5>
                        <button className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow" onClick={(event) => openAddModal(event)}>
                            Add Holdings
                        </button>
                    </div>
                }
                </div>
                <div id="add-holdings-modal" className="modal overflow-hide">
                    <ShareSearch symbol=""/>
                </div>

                <div id="chart-modal" className="modal eq-modal">
                    <div className="modal-content">
                        <LineChart symbol={chartSymbol}/>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default Holdings;