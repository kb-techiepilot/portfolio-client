import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { css } from '@emotion/react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import NumberFormat from './../../util/NumberFormat';

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

    useEffect(async () => {
        const token = await getAccessTokenSilently();
        const intervalId = setInterval(() => { 
            axios
            .get("https://kb-shares.azurewebsites.net/api/v1/summary/", {
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
        }, 10000);
        return () => clearInterval(intervalId);
    },[]);
    return(
            <div className="row pt-0">
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-light-blue-cyan gradient-shadow min-height-100 white-text animate fadeLeft">
                        <div className="padding-4">
                            <div className="row">
                                <div className="col s7 m4">
                                    <i className="material-icons background-round mt-5">add_shopping_cart</i>
                                    <p><h5>Investment</h5></p>
                                </div>
                                <div className="col s7 m8 right-align">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <h4 className="mb-0 white-text">{NumberFormat(summary.total_amount)}</h4>
                                    : <></> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-red-pink gradient-shadow min-height-100 white-text animate fadeLeft">
                        <div className="padding-4">
                            <div className="row">
                                <div className="col s7 m4">
                                    <i className="material-icons background-round mt-5">account_balance_wallet</i>
                                    <p><h5>Asset</h5></p>
                                </div>
                                <div className="col s7 m8 right-align">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <h4 className="mb-0 white-text">{NumberFormat(summary.current_amount)}</h4>
                                    : <></> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-amber-amber gradient-shadow min-height-100 white-text animate fadeRight">
                        <div className="padding-4">
                            <div className="row">
                                <div className="col s7 m4">
                                    <i className="material-icons background-round mt-5">timeline</i>
                                    <p><h5>Difference</h5></p>
                                </div>
                                <div className="col s7 m8 right-align">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <h4 className="mb-0 white-text">{NumberFormat(summary.difference)}</h4>
                                    : <></> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 m6 l6 xl3">
                    <div className="card gradient-45deg-green-teal gradient-shadow min-height-100 white-text animate fadeRight">
                        <div className="padding-4">
                            <div className="row">
                                <div className="col s7 m4">
                                    <i className="material-icons background-round mt-5">attach_money</i>
                                    <p><h5>Profit</h5></p>
                                </div>
                                <div className="col s7 m8 right-align">
                                    <BeatLoader loading={loading} css={override} size={15} />
                                    { !loading ? 
                                    <h4 className="mb-0 white-text">{summary.percentage}%</h4>
                                    : <></> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default SummaryCards;