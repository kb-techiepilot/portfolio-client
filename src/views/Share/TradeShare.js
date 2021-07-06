import React, {useState, useEffect} from "react";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import moment, { max } from "moment";
import { BarLoader } from 'react-spinners';
import { css } from '@emotion/react';

import config from "../../config";
import NumberFormat from "../../util/NumberFormat";


function BuyShare(props){

    var today = moment().format("YYYY-MM-DD")
    
    const { getAccessTokenSilently } = useAuth0();
    const [stockDetail, setStockDetail] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    
    const [buyPreLoader, setBuyPreloader] = useState(true);
    const [checked, setChecked] = useState(props.checked);
    const [disableCheck, setDisableCheck] = useState(false);
    
    const [disableButton, setDisableButton] = useState(false);
    
    const [maxQty, setMaxQty] = useState(1000000);
    
    const [symbol, setSymbol] = useState("");
    
    const override = css`
    display: block;
    `;
    
    useEffect(() => {
        var elems = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems, {});
    })

    useEffect(() => {
        async function fetchStockDetail() {
            const token = await getAccessTokenSilently();
            axios
            .get(config.apiBaseUrl+"/api/v2/holdings/"+props.symbol+"?workspace=default",{
                headers: {
                Authorization: `Bearer ${token}`,
                }})
            .then(res => {
                setBuyPreloader(false);
                // var dummyData = {
                //     "priceInfo" : {
                //         "lastPrice" : 1234
                //     },
                //     "info" : {
                //         "symbol" : "SBIN"
                //     }

                // }
                setStockDetail(res.data);
                setPrice(res.data.current_price);
                setDisableCheck(res.data.holdings_id !== null ? false : true);
                setSymbol(res.data.symbol);
                // setStockDetail(dummyData);
                // setPrice(dummyData.priceInfo.lastPrice);
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
    },[getAccessTokenSilently, props.symbol, symbol, checked]); 

    async function addHoldings(event) {
        setSymbol("");
        setBuyPreloader(true);
        event.preventDefault();

        var param = {
            workspace : 'default',
            date: date,
            symbol : props.symbol,
            quantity: quantity,
            price: price
        };

        var uri = "/api/v2/holdings/";

        if(stockDetail.holdings_id !== null) {
            param.average=true;
            uri = "/api/v2/holdings/"+stockDetail.holdings_id;
        }

        const token = await getAccessTokenSilently();
        axios
        .post(config.apiBaseUrl+uri, param,{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            setBuyPreloader(false);
            setStockDetail(res.data);
            setSymbol(res.data.symbol);
            M.toast({html: 'Added to holdings!'},{
                displayLength: 4000
            });
        })
        .catch(err =>{
            setBuyPreloader(false)
            console.log(err.response);
            M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    async function sellHoldings(event) {
        setBuyPreloader(true);
        event.preventDefault();

        var param = {
            workspace : 'default',
            solddate: date,
            symbol : props.symbol,
            quantity: quantity,
            price: price
        };

        var uri = "/api/v2/sold/"+stockDetail.holdings_id;

        if(quantity < stockDetail.quantity) {
            param.partial=true;
        }

        const token = await getAccessTokenSilently();
        axios
        .post(config.apiBaseUrl+uri, param,{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            setBuyPreloader(false);
            M.toast({html: 'sold success!'},{
                displayLength: 4000
            });
        })
        .catch(err =>{
            setBuyPreloader(false)
            console.log(err.response);
            M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    function changeQuantity(event){
        console.log(event.target.value > 0)
        if(event.target.value > 0){
            setQuantity(event.target.value);
            setDisableButton(false);
        } else {
            setDisableButton(true);
        }
    }

    function changePrice(event){
        event.preventDefault();
        if(event.target.value > 0) {
            setPrice(event.target.value);
            setDisableButton(false);
        } else {
            setDisableButton(true);
        }
    }

    function changeDate(event){
        event.preventDefault();
        setDate(moment(event.target.value).format("YYYY-MM-DD"));
    }

    function changeSwitch(event){
        setChecked(!checked);
    }

    return(
        <div className="">
            <BarLoader loading={buyPreLoader} css={override} width={"100%"} />
            {stockDetail &&
                <div>
                    <div data-id="1" data-order="1" className="kanban-board">
                        <header className={checked ? "kanban-board-header yellow" : "kanban-board-header blue"}>
                            <div className="row">
                            { !checked ?
                                <div className="col s8 kanban-title-board line-ellipsis">
                                    <span>Buy </span>
                                    <span>{stockDetail.symbol} </span>
                                    x
                                    <span> {quantity}</span> Qty.
                                </div>
                                :

                                <div className="col s8 kanban-title-board line-ellipsis">
                                    <span>Sell </span>
                                    <span>{stockDetail.symbol} </span>
                                    x
                                    <span> {quantity}</span> Qty.
                                </div>
                            }
                                <div className="col s4">
                                    <div className="switch">
                                    {disableCheck ?
                                        <label className="tooltipped" data-position="bottom" data-tooltip="You don't have this stock in your holdings to sell">
                                            <input disabled type="checkbox" onChange={(event) => changeSwitch(event)} defaultChecked={checked}/>
                                            <span className="lever" data-on="on"></span>
                                        </label>
                                        :
                                        <label className="tooltipped" data-position="top" data-tooltip="Toggle Buy / Sell">
                                            <input type="checkbox" onChange={(event) => changeSwitch(event)} defaultChecked={checked}/>
                                            <span className="lever" data-on="on"></span>
                                        </label>
                                    }
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className="kanban-drag">
                            <div className="kanban-item">
                                <div className="row">
                                    <div className="input-field col s4">
                                        <input id="qty" type="number" min="1" max={(checked && stockDetail.quantity) || maxQty} defaultValue={(checked && stockDetail.quantity) || quantity} onChange={(event) => changeQuantity(event)} className="validate"/>
                                        <label className="active" htmlFor="qty">Qty</label>
                                    </div>
                                    <div className="input-field col s4">
                                        <input id="price" type="number" min="0" defaultValue={stockDetail.current_price} onChange={(event) => changePrice(event)} className="validate"/>
                                        <label className="active" htmlFor="price">Price</label>
                                    </div>
                                    <div className="input-field col s4">
                                        <input readOnly id="amount" type="text" min="0.01" value={NumberFormat(quantity * price)}/>
                                        <label className="active" htmlFor="amount">Amount</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s6">
                                        <input type="date" name="begin" defaultValue={date} placeholder="dd-mm-yyyy" min="1997-01-01" max={today} onChange={(event) => changeDate(event)}/>
                                    </div>
                                    {!checked ?
                                    <div className="col s6">
                                        <span disabled={disableButton} className="btn waves-effect blue gainers-head" onClick={(event) => addHoldings(event)}>{(setStockDetail.holdings_id !== null && setStockDetail.holdings_id !== undefined )? 'Buy More' : 'Buy'}</span> 
                                    </div>
                                    :
                                    <div className="col s6">
                                        <span disabled={disableButton} className="btn waves-effect yellow losers-head" onClick={(event) => sellHoldings(event)}>Sell</span> 
                                    </div>
                                    }
                                </div>
                                {/* <div className="kanban-footer mt-3">
                                    <div className="kanban-due-date center mb-5 lighten-5 green">
                                        <span className="green-text center"> Buy</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default BuyShare;
