import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';
import { Loading } from '../components';
import M from 'materialize-css';

import config from '../config';
import NumberFormat from '../util/NumberFormat';

function Transaction() {

    const { getAccessTokenSilently } = useAuth0();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brokers, setBrokers] = useState({});
    const [broker, setBroker] = useState(-1);

    useEffect(()=> {

        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    })

    useEffect(() => {
        async function fetchTrasancations() {
            const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/transactions?broker_id="+broker, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }})
                .then(res => {
                    setTransactions(res.data.data);
                })
                .catch(err =>{
                console.log(err.message);
                });
        }
        fetchTrasancations();
    },[getAccessTokenSilently, broker]);

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

    return (
        <main>
            <div>
                <div className="row">
                    <div className="col s4 left mb-2">
                        <h4 className="blue-text">Transactions</h4>
                    </div>
                    <div className="input-field col offset-s4 s4">
                        <select onChange={(event) => changeBroker(event)} defaultValue={broker}>
                            <option value="-1">All</option>
                            {!loading && brokers.map((broker, index) => 
                                <option key={index} value={broker.broker_id}>{broker.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                {/* <div className="content-wrapper-before blue-grey lighten-5"></div> */}
                <div className="col s12">
                    <div className="container">
                        <section className="wishlist-wrapper section">
                            {transactions !== undefined && transactions.length === 0 ?
                                <div className="center mt-10">
                                    <img src={process.env.PUBLIC_URL + '../../images/empty-dish.png'} alt="" style={{"height" : "100px"}}/>
                                    <h5>
                                        You haven't done any transactions in your account
                                    </h5>
                                </div>
                            :
                            <table className="highlight white responsive-table display-in-block">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Amount</th>
                                        <th>Broker</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions !== undefined && transactions.map((transaction, index) => 
                                    <tr key={index}>
                                        <td>{transaction.symbol}</td>  
                                        <td>{moment(transaction.date).format("YYYY-MM-DD")}</td>  
                                        <td>
                                            {transaction.type === 'Sell' ?
                                                <span className="chip lighten-5 orange orange-text">Sell</span>
                                                :
                                                <span className="chip lighten-5 green green-text">Buy</span>
                                            }
                                        </td>
                                        <td>{transaction.quantity}</td>  
                                        <td>&#8377;{transaction.price}</td>  
                                        <td>{NumberFormat(transaction.amount)}</td>  
                                        <td>{transaction.broker_name}</td>  
                                    </tr>)}
                                </tbody>
                            </table>
                        }
                        </section>
                    </div> 
                </div>
            </div>
        </main>
    )
}

export default Transaction;