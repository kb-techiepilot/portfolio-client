import React, { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";
import axios from 'axios';

import config from '../../config';

function IndexCards(){

    const [indexData, setIndexData] = useState([]);

    useEffect(()=>{
        getTopStocks();
        const intervalId = setInterval(() => {
            getTopStocks();
        }, 10000)
        return () => clearInterval(intervalId);
    },[])

    function getTopStocks(){
        axios
            .get(config.apiBaseUrl+"/api/v2/nse/topstocks")
            .then(res => {
                setIndexData(res.data.data);
            })
            .catch(err =>{
                console.log(err.message);
            });
    }

    return(
        <>
        <Marquee pauseOnHover={true} gradient={false}>
            <div className="row marq-stocks">
                <div className="col marq-items ticker-item-root pointer relative " data-pos="0">
                    <span className="price symbol nowrap">Top Stocks :</span>
                </div>
                {indexData !== undefined && indexData.map((data, index) => 
                    <div key={index} className="col marq-items ticker-item-root pointer relative " data-pos="0">
                        <span className="price symbol nowrap">{data.symbol}</span>
                        <span className="price">{data.ltp}</span>
                        <span className={ data.netPrice > 0 ? "price change up" : "price change down"}>{data.netPrice}</span>
                    </div>
                )}
                
            </div>
        </Marquee>
        </>
    )
};

export default IndexCards;