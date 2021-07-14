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
import HoldingsSkeleton from './HoldingsSkeleton';

function Holdings(){
    const { getAccessTokenSilently } = useAuth0(); 

    const [holdings, setHoldings] = useState([]);
    const [chartSymbol, setChartSymbol] = useState("");
    const [preload, setPreload] = useState(true);

    const [brokers, setBrokers] = useState({});
    const [broker, setBroker] = useState(-1);

    const [loading, setLoading] = useState(true);

    const [skeletonLoad, setSkeletonLoad] = useState(true);

    const override = css`
        display: block;
    `;

    useEffect(() => {
        async function fetchHoldings() {
            setSkeletonLoad(true);
            const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/holdings?workspace=default&broker_id="+broker,{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }},{ validateStatus: false })
                .then(res => {
                    setHoldings(res.data.data);
                    setPreload(false);
                    setSkeletonLoad(false);
                })
                .catch(err =>{
                console.log(err.message);
                });
        }
        fetchHoldings();

        const intervalId = setInterval(() => { 
            fetchHoldings();
        }, 2000 * 100);
        return () => clearInterval(intervalId);
    },[getAccessTokenSilently,broker]);

    useEffect(()=> {
        var elems = document.querySelectorAll('.collapsible');
        M.Collapsible.init(elems, {});

        elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    })

    useEffect(()=> {
        async function fetchBroker() {
            setLoading(true);
            const token = await getAccessTokenSilently();
            axios
            .get(config.apiBaseUrl+"/api/v2/broker",{
                headers: {
                Authorization: `Bearer ${token}`,
                }},{ validateStatus: false })
            .then(res => {
                setBrokers(res.data);
                setBroker(res.data[0].broker_id)
                setLoading(false);
            })
            .catch(err =>{
            console.log(err.message);
            });
        }
        fetchBroker();
    },[getAccessTokenSilently]);

    function changeBroker(event){
        setBroker(event.target.value);
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

        var elems = document.querySelectorAll('#add-holdings-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }
    return(
        <main>
            {/* <BarLoader loading={preload} css={override} width={"100%"} /> */}
            <div>


            <div className="row">
                    <div className="input-field col offset-s8 s4">
                        <select onChange={(event) => changeBroker(event)}>
                            <option value="-1">All</option>
                            {!loading && brokers.map((broker, index) => 
                                <option value={broker.broker_id}>{broker.name}</option>
                            )}
                        </select>
                        {/* <label>Select Broker</label> */}
                    </div>
                </div>
                <div className="row">
                    <div className="hide-on-med-and-down" >
                        <SummaryCards broker={broker}/>
                    </div>
                    <ul className="collapsible hide-on-med-and-up">
                        <li>
                            <div className="collapsible-header"><i className="material-icons">filter_drama</i>Summary</div>
                            <div className="collapsible-body"><SummaryCards/></div>
                        </li>
                    </ul>
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
                                {skeletonLoad ?
                                <HoldingsSkeleton/>
                                :
                               <>
                            {holdings !== undefined && holdings.length > 0 ?
                                <table className="highlight white">
                                    <thead>
                                        <tr>
                                            <th>Stock</th>
                                            <th>Net Qty.</th>
                                            <th>Avg. Price</th>
                                            <th>Invested Amt.</th>
                                            <th>Current Value</th>
                                            <th>Day P&L</th>
                                            <th>Overall P&L</th>
                                            <th>Overall %</th>
                                            <th>Broker</th>
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
                                                            <span>{holding.current_price} </span>
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
                                            <td>{NumberFormat(holding.overall_pl)}</td>  
                                            <td>{holding.overall_percent}</td>  
                                            <td>{holding.broker_name}</td>  
                                            
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
                                :
                                <>
                                <div className="center mt-10">
                                    <img src={process.env.PUBLIC_URL + '../../images/empty-dish.png'} alt="" style={{"height" : "100px"}}/>
                                    <h5>
                                        You haven't added any Stock to your account, use the search bar or clieck below to add Holdings
                                    </h5>
                                    <button className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow" onClick={(event) => openAddModal(event)}>
                                        Add Holdings
                                    </button>
                                </div>
                                </>
                            }</>}
                            </section>
                        </div>
                    </div>
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