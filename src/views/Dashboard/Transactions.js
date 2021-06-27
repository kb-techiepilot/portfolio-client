import React, {useState, useEffect} from 'react';
import axios from 'axios';
import config from '../../config';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';

import NumberFormat from '../../util/NumberFormat';

function Transactions(){

    const { getAccessTokenSilently } = useAuth0();
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        async function fetchTrasancations() {
            const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/transactions/top", {
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
    },[getAccessTokenSilently]);

    return (
        <>
        <div className="card animate fadeUp">
            <div className="card-content">
                <span className="card-title">Recent Transactions</span>
                <table className="highlight responsive-table">
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
                        {transactions.map((transaction, index) => 
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
            </div>
        </div>
        </>
    )
}

export default Transactions;