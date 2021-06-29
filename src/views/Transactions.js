import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';
import { Loading } from '../components';

import config from '../config';
import NumberFormat from '../util/NumberFormat';

function Transaction() {

    const { getAccessTokenSilently } = useAuth0();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrasancations() {
            const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/transactions", {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }})
                .then(res => {
                    setLoading(false);
                    setTransactions(res.data.data);
                })
                .catch(err =>{
                console.log(err.message);
                });
        }
        fetchTrasancations();
    },[getAccessTokenSilently]);
    return (
        <main>
            {loading ?
                <Loading />
            :

            <div className="row">
                <div className="content-wrapper-before blue-grey lighten-5"></div>
                <div className="col s12">
                    <div className="container">
                        <section className="wishlist-wrapper section">
                        <table className="highlight white responsive-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Amount</th>
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
                                </tr>)}
                            </tbody>
                        </table>
                        </section>
                    </div> 
                </div>
            </div>
            }
        </main>
    )
}

export default Transaction;