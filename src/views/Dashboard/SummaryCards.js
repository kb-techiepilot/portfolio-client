import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { css } from '@emotion/react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import NumberFormat from './../../util/NumberFormat';
import config from '../../config';

import '../../assets/css/summary.css';

function SummaryCards() {

    const { getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({});

    const override = css`
        display: block;
        margin: 10 !important;
        border-color: red;
        padding: 32px;
    `;

    useEffect(() => {
        async function fetchSummary() {
            const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/summary/", {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }})
                .then(res => {
                setLoading(false);
                setSummary(res.data);
                })
                .catch(err =>{
                console.log(err.message);
                });
        }
        fetchSummary();

        const intervalId = setInterval(() => { 
            fetchSummary();
        }, 10000);
        return () => clearInterval(intervalId);
    },[getAccessTokenSilently]);
    return(
            <div className="row pt-0">
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-light-blue-cyan gradient-shadow min-height-100 white-text animate fadeLeft">
                        <div className="padding-4">
                            <div className="row">
                                <div className="row">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <h4 className="col s7 m12 mb-0 white-text">{NumberFormat(summary.total_amount)}</h4>
                                    : <></> }
                                </div>
                                <div className="col s7 m8">
                                    <h5>Investment</h5>
                                </div>
                                <div className="col s7 m2 right-align hide-on-med-and-down">
                                    <i className="material-icons background-round mt-5">add_shopping_cart</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-red-pink gradient-shadow min-height-100 white-text animate fadeLeft">
                        <div className="padding-4">
                            <div className="row">
                                <div className="row">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <h4 className="col s7 m12 mb-0 white-text">{NumberFormat(summary.current_amount)}</h4>
                                    : <></> }
                                </div>
                                <div className="col s7 m8">
                                    <h5>Net Worth</h5>
                                </div>
                                <div className="col s7 m2 right-align hide-on-med-and-down">
                                    <i className="material-icons background-round mt-5">account_balance_wallet</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-amber-amber gradient-shadow min-height-100 white-text animate fadeRight">
                        <div className="padding-4">
                            <div className="row">
                                <div className="row">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <>
                                    <h4 className="col s7 m12 mb-0 white-text">
                                        {NumberFormat(summary.difference)}
                                        <span className="font-medium text-30"> ({summary.percentage}%)</span>
                                    </h4>
                                    </>
                                    : <></> }
                                </div>
                                <div className="col s7 m8">
                                    <h5>Net P&L</h5>
                                </div>
                                <div className="col s7 m2 right-align hide-on-med-and-down">
                                    <i className="material-icons background-round mt-5">timeline</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-green-teal gradient-shadow min-height-100 white-text animate fadeRight">
                        <div className="padding-4">
                            <div className="row">
                                <div className="row">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <h4 className="col s7 m12 mb-0 white-text">
                                        {NumberFormat(summary.day_change)}
                                        <span className="font-medium text-30"> ({summary.day_prechent}%)</span>
                                    </h4>
                                    : <></> }
                                </div>
                                <div className="col s7 m8">
                                    <h5>Day P&L</h5>
                                </div>
                                <div className="col s7 m2 right-align hide-on-med-and-down">
                                    <i className="material-icons background-round mt-5">attach_money</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default SummaryCards;