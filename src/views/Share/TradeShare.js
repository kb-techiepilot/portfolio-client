import React, {useState, useEffect} from "react";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import moment from "moment";
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

    const [brokers, setBrokers] = useState({});
    const [broker, setBroker] = useState(-1);
    
    const [disableButton, setDisableButton] = useState(false);
    
    const [maxQty] = useState(1000000);
    
    const [symbol, setSymbol] = useState("");
    const [loading, setLoading] = useState(true);
    
    const override = css`
    display: block;
    `;
    
    useEffect(() => {
        var elems = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems, {});

        elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    })

    useEffect(()=> {
        setChecked(props.checked);
    },[props.checked])

    useEffect(() => {
        async function fetchStockDetail() {
            setBuyPreloader(true);
            const token = await getAccessTokenSilently();
            broker > 0 &&
            axios
            .get(config.apiBaseUrl+"/api/v2/holdings/"+props.symbol+"?workspace=default&broker_id="+broker,{
                headers: {
                Authorization: `Bearer ${token}`,
                }})
            .then(res => {
                console.log(res.data)
                setBuyPreloader(false);
                setStockDetail(res.data.data[0]);
                setPrice(res.data.data[0].current_price);
                setDisableCheck(res.data.data[0].holdings_id !== null ? false : true);
                setSymbol(res.data.data[0].symbol);
            })
            .catch(err =>{
            console.log(err);
            });
        }
        props.symbol && fetchStockDetail();
        const intervalId = setInterval(() => { 
            props.symbol && fetchStockDetail();
        }, 5000 * 100);
        return () => clearInterval(intervalId);
    },[getAccessTokenSilently, props.symbol, symbol, checked, broker, brokers]); 

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

    async function addHoldings(event) {
        setSymbol("");
        setBuyPreloader(true);
        event.preventDefault();

        var param = {
            workspace : 'default',
            date: date,
            symbol : props.symbol,
            quantity: quantity,
            price: price,
            broker_id: broker
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
            price: price,
            broker_id: broker
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

    function changeBroker(event){
        setBroker(event.target.value);
        event.preventDefault();
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
                                        <label className="tooltipped" data-position="top" data-tooltip="Toggle Buy / Sell">
                                            <input defaultChecked={checked} id="check1" type="checkbox" onChange={(event) => changeSwitch(event)}/>
                                            <span className="lever"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className="kanban-drag">
                            <div className="kanban-item">
                                <div className="row">

                                    <div className="input-field col s12">
                                        <select onChange={(event) => changeBroker(event)}>
                                            {!loading && brokers.map((broker, index) => 

                                                <option value={broker.broker_id}>{broker.name}</option>
                                            )}
                                        </select>
                                        <label>Select Broker</label>
                                    </div>
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
                                        <span disabled={disableButton} disableButton={disableCheck} className="btn waves-effect yellow losers-head" onClick={(event) => sellHoldings(event)}>Sell</span> 
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
