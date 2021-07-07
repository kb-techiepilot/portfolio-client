import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import { BarLoader } from 'react-spinners';
import { css } from '@emotion/react';

import config from '../../config';
import NumberFormat from '../../util/NumberFormat';
import DetailSkeleton from './DetailSkeleton';

import TradeShare from './TradeShare';

function ShareDetail(props) {

    const { getAccessTokenSilently } = useAuth0();
    const [shareDetail, setShareDetail] = useState({});
    const [holdings, setHoldings] = useState({});
    const [loading, setLoading] = useState(true);
    const [loader, setLoader] = useState(false);
    const [wishlists,setWishlists] = useState({});

    const [checked, setChecked] = useState(false);
    const [toggle, setToggle] = useState(false);

    const override = css`
        display: block;
    `;

    useEffect(()=> {
        var elems = document.querySelectorAll('#buy-modal');
        M.Modal.init(elems, {});
    })

    useEffect(() => {
        setLoading(true);
        async function fetchWishlist() {
            const token = await getAccessTokenSilently();
            axios
            .get(config.apiBaseUrl+"/api/v2/wishlist/"+ props.symbol +"?workspace=default",{
                headers: {
                Authorization: `Bearer ${token}`,
                }})
            .then(res => {
                setLoading(false);
                setShareDetail(res.data.wishlist);
                setHoldings(res.data.holdings);
            })
            .catch(err =>{
            console.log(err.message);
            });
        }
        props.symbol && fetchWishlist();
    },[props.symbol, getAccessTokenSilently, props.random, wishlists]); 

    async function addWishlist(event) {
        setLoader(true);
        event.preventDefault();
        const token = await getAccessTokenSilently();
        axios
        .post(config.apiBaseUrl+"/api/v2/wishlist/", {
            symbol : props.symbol,
            workspace : 'default'
        },{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            M.toast({html: 'Wishlist added !'},{
                displayLength: 4000
            });
            setShareDetail(res.data.wishlist);
            setLoader(false)
        })
        .catch(err =>{
            setLoader(false)
            err.response.data && M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    async function deleteWishlist(event, id) {
        setLoader(true);
        event.preventDefault();
        const token = await getAccessTokenSilently();
        axios
        .delete(config.apiBaseUrl+"/api/v2/wishlist/"+id +"?workspace=default",{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            setLoader(false);
            M.toast({html: 'Wishlist deleted !'},{
                displayLength: 4000
            });
            setWishlists(res.data.data);
        })
        .catch(err =>{
            setLoader(false)
            console.log(err.response);
            M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    function openBuyModal(event){
        setChecked(false);
        setToggle(!toggle);
    }

    function openSaleModal(event){
        setChecked(true);
        setToggle(!toggle);
    }

    useEffect(()=>{
        var elems = document.querySelectorAll('#buy-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    },[checked, toggle])

    return(
        <div>
            {!loading && props.symbol !== "" && shareDetail !== undefined && holdings !== undefined?
            <div className="card">

                <BarLoader loading={loader} css={override} width={"100%"} />
                <div className="card-content">
                    <div className="flex-apart full-width">
                        <div className="wishlist-card-title" style={{"width": "60%"}}>
                            {shareDetail.company_name}
                        </div>
                        <div className="flex-apart" style={{"width": "40%"}}>
                            <span>
                                {shareDetail.wishlist_id === null ?
                                    <a href="#!" onClick={(event) => addWishlist(event)}><i className="material-icons small">star_border</i></a>
                                :
                                <a href="#!" onClick={(event) => deleteWishlist(event, shareDetail.wishlist_id)}><i className="material-icons small">star</i></a>
                                }
                            </span>
                        </div>
                    </div>
                    <div className="row mrt-10">
                        <div className="wishlist-data col s6">
                            <div className="wishlist-symbol">
                                {shareDetail.symbol}
                            </div>
                            <div className="wishlist-index">
                                {shareDetail.index}
                            </div>
                        </div>
                        <div className="col s6">
                            <div className="wishlist-symbol wishlist-ta-rt">
                                {NumberFormat(shareDetail.current_price)}
                            </div>
                            <div className="wishlist-index wishlist-ta-rt">
                                {shareDetail.change}({shareDetail.percent_change}%)
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
                                            {shareDetail.open}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Upper Circuit
                                        </div>
                                        <div className="wishlist-symbol">
                                            {shareDetail.higher_cp}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Volume
                                        </div>
                                        <div className="wishlist-symbol">
                                            {shareDetail.trade !== undefined && shareDetail.trade.volume}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Close
                                        </div>
                                        <div className="wishlist-symbol">
                                            {shareDetail.previous_close}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Lower Circuit
                                        </div>
                                        <div className="wishlist-symbol">
                                            {shareDetail.lower_cp}
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            Avg. Traded Price
                                        </div>
                                        <div className="wishlist-symbol">
                                            {shareDetail.avg_price}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                </div>
                                <div className="row mt-5">
                                    <div className="mb4 slider-pos relative wishlist-1D full-width">
                                        <span className="year-slider" style={{"left" : ((shareDetail.current_price - shareDetail.day_low) * 100 / (shareDetail.day_high - shareDetail.day_low) ) + "%"}}>
                                        </span>
                                    </div>
                                    <div className="flex-apart full-width wishlist-slider">
                                        <span>{shareDetail.day_low}</span>
                                        <span>TODAY's HIGH/LOW</span>
                                        <span>{shareDetail.day_high}</span>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="mb4 slider-pos relative wishlist-52 full-width">
                                        <span className="year-slider" style={{"left" : ((shareDetail.current_price - shareDetail.year_low) * 100 / (shareDetail.year_high - shareDetail.year_low) ) + "%"}}>
                                        </span>
                                    </div>
                                    <div className="flex-apart full-width wishlist-slider">
                                        <span>{shareDetail.year_low}</span>
                                        <span>52 WEEK HIGH/LOW</span>
                                        <span>{shareDetail.year_high}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s7 offset-s5 flex-apart hide-on-med-and-down">
                            <span className="btn waves-effect waves-green gainers-head" onClick={(event) => openBuyModal(event)}>Buy</span>
                            <span className={holdings.holdings_id !== undefined ? "btn waves-effect waves-red losers-head " : "hide"} onClick={(event) => openSaleModal(event)}>Sell</span>
                            <span class="btn waves-effect waves-purple cancel-btn modal-close">Cancel</span>
                        </div>
                        <div className="col s9 offset-s3 flex-apart hide-on-med-and-up">
                            <span className="btn waves-effect waves-green gainers-head" onClick={(event) => openBuyModal(event)}>Buy</span>
                            <span className={holdings.holdings_id !== undefined ? "btn waves-effect waves-red losers-head " : "hide"} onClick={(event) => openSaleModal(event)}>Sell</span>
                            <span class="btn waves-effect waves-purple modal-close">Cancel</span>
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
                                            {shareDetail.trade !== undefined && shareDetail.trade.bids.map((bid, index) => 
                                            <tr key={index}>
                                                <td>{bid.price}</td>
                                                <td className="wishlist-ta-rt">{bid.quantity}</td>
                                            </tr>)}
                                            <tr>
                                                <th>TBQ</th>
                                                <th className="wishlist-ta-rt">{shareDetail.trade !== undefined && shareDetail.trade.total_buy_qty}</th>
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
                                            {shareDetail.trade !== undefined && shareDetail.trade.asks.map((ask, index) => 
                                            <tr key={index}>
                                                <td>{ask.price}</td>
                                                <td className="wishlist-ta-rt">{ask.quantity}</td>
                                            </tr>)}
                                            <tr>
                                                <th>TSQ</th>
                                                <th className="wishlist-ta-rt">{shareDetail.trade !== undefined && shareDetail.trade.total_sell_qty}</th>
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
                    <TradeShare symbol={props.symbol} checked={checked}/>
                </div>
            </div>
        </div>
    )
};

export default ShareDetail;