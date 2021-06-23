import React, { useEffect } from 'react';
import M from 'materialize-css';
import 'material-icons/iconfont/material-icons.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

import config from '../../config';


function ChartHeader(props){
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const green = "price-green";
    const red = "price-red";

    const change = props.current.priceInfo.lastPrice - props.previousClosing;
    const pChange = (change / props.previousClosing) * 100;

    useEffect(() => {
        var elems = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems, {});
    });  

    function getTimeText(){
        var timeLine = props.timeLine;
        var timeText = "";
        switch(timeLine){
            case 'one_day':
                timeText="today";
                break;
            case 'five_days':
                timeText="past 5 days";
                break;
              case 'one_month':
                  timeText="past month";
                  break;
              case 'three_months':
                  timeText="past 3 months";
                  break;
            case 'six_months':
                timeText="past 6 months";
                break;
            case 'nine_months':
                timeText="past 9 months";
                break;
            case 'ytd':
                timeText="year to date";
                break;
            case 'one_year':
                timeText="past year";
                break;
            case 'five_years':
                timeText="past 5 years";
                break;
            default:
                break;
        }
        return timeText;
    }

    async function handleWishlist(symbol) {
        const token = await getAccessTokenSilently();
        axios
        .post(config.apiBaseUrl+"/api/v2/wishlist/", {
            symbol : symbol,
            workspace : 'default'
        },{
            headers: {
            Authorization: `Bearer ${token}`,
            }})
        .then(res => {
            M.toast({html: '<span>Added to wishlist &nbsp;</span><a href="/wishlists"> see all wishlists </a>'});
        })
        .catch(err =>{
            console.log(err.message);
        });
    }
    
    return(
        <>
        {props.current !== undefined && 
            <div className="row">
              <div className="col s9">
                <h5>{props.current.info.companyName}</h5>
                <h4><span>&#8377;</span>{props.current.priceInfo.lastPrice.toFixed(2)}</h4>
                <h6 className={change > 0 ? green : red}>
                  {change.toFixed(2)}  ({pChange.toFixed(2)}%)
                  {change > 0 ?
                    <i className="small material-icons">arrow_upward</i> 
                    :
                    <i className="small material-icons">arrow_downward</i> 
                  }
                  {getTimeText()}
                </h6>
              </div>
              {isAuthenticated ? 
                <div className="col s3">
                    <div className="row">
                    <div className="col s4">
                        <a onClick={() => handleWishlist(props.current.info.symbol)} className="tooltipped" data-position="bottom" data-tooltip="Bookmark" href="#!">
                            <i className="material-icons">bookmark_border</i>
                        </a>
                    </div>
                    <div className="col s4">
                        <a className="tooltipped" data-position="bottom" data-tooltip="Buy" href="#!">
                            <div className="chip lighten-5 green green-text">
                                Buy
                            </div>
                        </a>
                    </div>
                    <div className="col s4">
                        <a className="tooltipped" data-position="bottom" data-tooltip="Sell" href="#!">
                            <div className="chip lighten-5 orange orange-text">
                                Sell
                            </div>
                        </a>
                    </div>
                    </div>
                </div>
                :
                <></>
              }
            </div>
          }
    </>
    )
};

export default ChartHeader;