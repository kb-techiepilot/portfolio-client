import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';

import config from '../../config';
import NumberFormat from '../../util/NumberFormat';
import DetailSkeleton from './DetailSkeleton';

import BuyShare from './BuyShare';

function WishlistDetail(props) {
    const { getAccessTokenSilently } = useAuth0();
    const [wishlistDetail, setWishlistDetail] = useState({});
    const [holdings, setHoldings] = useState({});
    const [loading, setLoading] = useState(true);

    const [checked, setChecked] = useState(false);

    useEffect(()=> {
        var elems = document.querySelectorAll('#buy-modal');
        M.Modal.init(elems, {});
    })

    useEffect(() => {
        async function fetchWishlist() {
            setLoading(true);
            const token = await getAccessTokenSilently();
            axios
            .get(config.apiBaseUrl+"/api/v2/wishlist/"+ props.symbol +"?workspace=default",{
                headers: {
                Authorization: `Bearer ${token}`,
                }})
            .then(res => {
                setLoading(false);
                setWishlistDetail(res.data.wishlist);
                setHoldings(res.data.holdings);
            })
            .catch(err =>{
            console.log(err.message);
            });
        }
        props.symbol && fetchWishlist();
    },[props.symbol, getAccessTokenSilently]); 


    function openBuyModal(event){
        event.preventDefault();

        var elems = document.querySelectorAll('#buy-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }

    function openSaleModal(event){
        event.preventDefault();

        setChecked(true);
        var elems = document.querySelectorAll('#buy-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }

    return(
        <div>
            {!loading && props.symbol !== "" ?
            <div className="card">
                <div className="card-content">
                    <div className="flex-apart full-width">
                        <div className="wishlist-card-title">
                            {wishlistDetail.company_name}
                        </div>
                        <div className="flex-apart">
                            <span className={holdings.holdings_id !== undefined ? "btn waves-effect waves-green gainers-head right-10 " : "hide"} onClick={(event) => openBuyModal(event)}>Buy More</span>
                            <span className={holdings.holdings_id === undefined ? "btn waves-effect waves-green gainers-head right-10 " : "hide"} onClick={(event) => openBuyModal(event)}>Buy</span>
                            <span className={holdings.holdings_id !== undefined ? "btn waves-effect waves-red losers-head " : "hide"} onClick={(event) => openSaleModal(event)}>Sell</span>
                        </div>
                    </div>
                    <div className="row mrt-10">
                        <div className="wishlist-data col s6">
                            <div className="wishlist-symbol">
                                {wishlistDetail.symbol}
                            </div>
                            <div className="wishlist-index">
                                {wishlistDetail.index}
                            </div>
                        </div>
                        <div className="col s6">
                            <div className="wishlist-symbol wishlist-ta-rt">
                                {NumberFormat(wishlistDetail.current_price)}
                            </div>
                            <div className="wishlist-index wishlist-ta-rt">
                                {wishlistDetail.change}({wishlistDetail.percent_change}%)
                            </div>
                        </div>
                        {/* <div className="col s2">
                            <div className="wishlist-symbol wishlist-bookmark">
                                <i className="material-icons">bookmark</i>
                            </div>
                        </div> */}
                    </div>
                    <div className="row mrt-10">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    Market Stats
                                </span>
                                <div className="row">
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Open
                                        </div>
                                        <div className="wishlist-symbol">
                                            {wishlistDetail.open}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Upper Circuit
                                        </div>
                                        <div className="wishlist-symbol">
                                            {wishlistDetail.higher_cp}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Volume
                                        </div>
                                        <div className="wishlist-symbol">
                                            {wishlistDetail.trade !== undefined && wishlistDetail.trade.volume}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Close
                                        </div>
                                        <div className="wishlist-symbol">
                                            {wishlistDetail.previous_close}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Lower Circuit
                                        </div>
                                        <div className="wishlist-symbol">
                                            {wishlistDetail.lower_cp}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Avg. Traded Price
                                        </div>
                                        <div className="wishlist-symbol">
                                            {wishlistDetail.avg_price}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                </div>
                                <div className="row mt-5">
                                    <div className="mb4 slider-pos relative wishlist-1D full-width">
                                        <span className="year-slider" style={{"left" : ((wishlistDetail.current_price - wishlistDetail.day_low) * 100 / (wishlistDetail.day_high - wishlistDetail.day_low) ) + "%"}}>
                                        </span>
                                    </div>
                                    <div className="flex-apart full-width wishlist-slider">
                                        <span>{wishlistDetail.day_low}</span>
                                        <span>TODAY's HIGH/LOW</span>
                                        <span>{wishlistDetail.day_high}</span>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="mb4 slider-pos relative wishlist-52 full-width">
                                        <span className="year-slider" style={{"left" : ((wishlistDetail.current_price - wishlistDetail.year_low) * 100 / (wishlistDetail.year_high - wishlistDetail.year_low) ) + "%"}}>
                                        </span>
                                    </div>
                                    <div className="flex-apart full-width wishlist-slider">
                                        <span>{wishlistDetail.year_low}</span>
                                        <span>52 WEEK HIGH/LOW</span>
                                        <span>{wishlistDetail.year_high}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="hide row mrt-10">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    Market Depth
                                </span>
                                <div className="flex-apart">
                                    <table className="market-depth white mrr-10">
                                        <thead className="market-depth-th">
                                            <tr>
                                                <th className="up">Bid Price</th>
                                                <th className="wishlist-ta-rt">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wishlistDetail.trade !== undefined && wishlistDetail.trade.bids.map((bid, index) => 
                                            <tr key={index}>
                                                <td>{bid.price}</td>
                                                <td className="wishlist-ta-rt">{bid.quantity}</td>
                                            </tr>)}
                                            <tr>
                                                <th>TBQ</th>
                                                <th className="wishlist-ta-rt">{wishlistDetail.trade !== undefined && wishlistDetail.trade.total_buy_qty}</th>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="market-depth white mrl-10">
                                        <thead className="market-depth-th">
                                            <tr>
                                                <th className="down">Ask Price</th>
                                                <th className="wishlist-ta-rt">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wishlistDetail.trade !== undefined && wishlistDetail.trade.asks.map((ask, index) => 
                                            <tr key={index}>
                                                <td>{ask.price}</td>
                                                <td className="wishlist-ta-rt">{ask.quantity}</td>
                                            </tr>)}
                                            <tr>
                                                <th>TSQ</th>
                                                <th className="wishlist-ta-rt">{wishlistDetail.trade !== undefined && wishlistDetail.trade.total_sell_qty}</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
                props.symbol !== "" ?
            <DetailSkeleton/>
            :
            <div className="center mt-10">
                <img src={process.env.PUBLIC_URL + '../../images/empty-dish.png'} alt="" style={{"height" : "100px"}}/>
                <h5>
                    Find a Stock
                </h5>
                <h6>
                    use the above search bar to find a stock
                </h6>
            </div>
            }


            <div id="buy-modal" className="modal wd-450 top-30">
                <div className="modal-content wishlist-data">
                    <BuyShare symbol={props.symbol} action="buy" checked={checked}/>
                </div>
            </div>
        </div>
    )
};

export default WishlistDetail;