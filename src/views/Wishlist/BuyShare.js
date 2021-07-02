import React, {useState, useEffect} from "react";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

import config from "../../config";

function BuyShare(props){
    console.log('buy : ' + props.symbol)

    const { getAccessTokenSilently } = useAuth0();
    const [buySymbol, setBuySymbol] = useState(props.symbol);
    const [stockDetail, setStockDetail] = useState({});
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStockDetail() {
            axios
            .get(config.apiBaseUrl+"/api/v1/symbols/current", {
                params: {
                    'symbol': props.symbol,
                }})
            .then(res => {
                setLoading(false);
                setStockDetail(res.data);
            })
            .catch(err =>{
            console.log(err.message);
            });
        }
        props.symbol && fetchStockDetail();
        const intervalId = setInterval(() => { 
            props.symbol && fetchStockDetail();
        }, 5000 * 100);
        return () => clearInterval(intervalId);
    },[props.symbol]); 

    return(
        <div className="">
            {stockDetail.info &&
                <div>
                    <span>Buy</span>
                    <span>{stockDetail.info.symbol}</span>
                    x
                    <span>{quantity} Qty.</span>
                </div>
            }
        </div>
    );
}

export default BuyShare;
