import React, { useState } from 'react';


function ChartHeader(props){

    const green = "price-green";
    const red = "price-red";

    const change = props.current.priceInfo.lastPrice - props.previousClosing;
    const pChange = (change / props.previousClosing) * 100;

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
    }
    return timeText;
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
                    <i class="small material-icons">arrow_upward</i> 
                    :
                    <i class="small material-icons">arrow_downward</i> 
                  }
                  {getTimeText()}
                </h6>
              </div>
            </div>
          }
    </>
    )
};

export default ChartHeader;