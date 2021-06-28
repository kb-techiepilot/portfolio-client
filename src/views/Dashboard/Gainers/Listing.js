import React, {useEffect, useState} from 'react';
import axios from 'axios';

import config from '../../../config';


function Listing(props){
    const [gainers, setGainers] = useState([]);
    const [losers, setLosers] = useState([]);

    useEffect(() => {
        axios
        .get(config.apiBaseUrl+props.url)
        .then(res => {
            setGainers(res.data.gainers.data);
            setLosers(res.data.losers.data);
        })
        .catch(err =>{
          console.log(err.message);
        });
    }, [props.url]);

    return (
        <>
        <table className="highlight">
            <thead className="gainers-head">
            <tr>
                <th>SYMBOL</th>
                <th>LTP</th>
                <th>%CHNG</th>
                <th className="hide">PRV.CLOSE</th>
            </tr>
            </thead>

            <tbody>
                {gainers.map((gainer, index) => 
                <tr key={index}>
                    <td>{gainer.symbol}</td>  
                    <td>&#8377;{gainer.ltp}</td>  
                    <td className="gainers-percent">{gainer.netPrice}</td>  
                    <td className="hide">&#8377;{gainer.previousPrice}</td>  
                </tr>)}
            </tbody>
        </table>
        <table className="highlight">
            <thead className="losers-head">
            <tr>
                <th>SYMBOL</th>
                <th>LTP</th>
                <th>%CHNG</th>
                <th>PRV.CLOSE</th>
            </tr>
            </thead>

            <tbody>
                {losers.map((loser, index) => 
                <tr key={index}>
                    <td>{loser.symbol}</td>  
                    <td>&#8377;{loser.ltp}</td>  
                    <td className="losers-percent">{loser.netPrice}</td>  
                    <td>&#8377;{loser.previousPrice}</td>  
                </tr>)}
            </tbody>
        </table>
        </>
    )
}

export default Listing;
