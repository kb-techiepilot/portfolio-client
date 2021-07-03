import React, {useState, useEffect} from "react";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import moment from "moment";

import config from "../../config";
import NumberFormat from "../../util/NumberFormat";


function BuyShare(props){
    console.log('buy : ' + props.symbol)

    var today = moment().format("YYYY-MM-DD")

    const { getAccessTokenSilently } = useAuth0();
    const [buySymbol, setBuySymbol] = useState(props.symbol);
    const [stockDetail, setStockDetail] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        M.updateTextFields();
        var elems = document.querySelectorAll('.datepicker');
    })

    useEffect(() => {
        async function fetchStockDetail() {
            // axios
            // .get(config.apiBaseUrl+"/api/v1/symbols/current", {
            //     params: {
            //         'symbol': props.symbol,
            //     }})
            // .then(res => {
                setLoading(false);
                var dummyData = {
                    "priceInfo" : {
                        "lastPrice" : 1234
                    },
                    "info" : {
                        "symbol" : "SBIN"
                    }

                }
                // setStockDetail(res.data);
                // setPrice(res.data.priceInfo.lastPrice);
                setStockDetail(dummyData);
                setPrice(dummyData.priceInfo.lastPrice);
            // })
            // .catch(err =>{
            // console.log(err.message);
            // });
        }
        props.symbol && fetchStockDetail();
        const intervalId = setInterval(() => { 
            props.symbol && fetchStockDetail();
        }, 5000 * 100);
        return () => clearInterval(intervalId);
    },[props.symbol]); 

    async function addHoldings(event) {
        event.preventDefault();

        const token = await getAccessTokenSilently();
        axios
        .post(config.apiBaseUrl+"/api/v2/holdings/", {
            workspace : 'default',
            date: date,
            symbol : props.symbol,
            quantity: quantity,
            price: price
        },{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            M.toast({html: 'Wishlist added !'},{
                displayLength: 4000
            });
            // setWishlists(res.data.data);
            // setPreloader(false)
        })
        .catch(err =>{
            // setPreloader(false)
            console.log(err.response);
            M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    function changeQuantity(event){
        event.preventDefault();
        setQuantity(event.target.value);
    }

    function changePrice(event){
        event.preventDefault();
        setPrice(event.target.value);
    }

    function changeDate(event){
        event.preventDefault();
        setDate(moment(event.target.value).format("YYYY-MM-DD"));
    }

    return(
        <div className="">
            {stockDetail.info &&
                <div>
                    <div data-id="1" data-order="1" className="kanban-board">
                        <header className="kanban-board-header blue">
                            <div className="kanban-title-board line-ellipsis">
                                <span>Buy </span>
                                <span>{stockDetail.info.symbol} </span>
                                x
                                <span> {quantity}</span> Qty.
                            </div>
                        </header>
                        <div className="kanban-drag">
                            <div className="kanban-item" data-eid="1_1" data-border="green" data-duedate="SEPTEMBER 9, 2019" data-comment="1" data-attachment="1" data-users="../../../app-assets/images/avatar/avatar-10.png">
                                <div className="row">
                                    <div className="input-field col s4">
                                        <input id="qty" type="number" min="1" defaultValue={quantity} onChange={(event) => changeQuantity(event)}/>
                                        <label className="active" htmlFor="qty">Qty</label>
                                    </div>
                                    <div className="input-field col s4">
                                        <input id="price" type="number" min="0.01" defaultValue={stockDetail.priceInfo.lastPrice} onChange={(event) => changePrice(event)}/>
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
                                    <div className="col s6">
                                        <span className="btn waves-effect waves-green gainers-head right-10" onClick={(event) => addHoldings(event)}>Buy</span> 
                                    </div>
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
