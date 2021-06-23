import React from 'react';

function ChartFooter(props){

    return(
        <>
        <table className = "responsive-table highlight">
                <tbody>
                    <tr>
                        <td>Open</td>
                        <td>{props.current.priceInfo.open.toFixed(2)}</td>
                        <td>Low CP</td>
                        <td>{props.current.priceInfo.lowerCP}</td>
                        <td>Prev close</td>
                        <td>{props.current.priceInfo.previousClose.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>High</td>
                        <td>{props.current.priceInfo.intraDayHighLow.max.toFixed(2)}</td>
                        <td>High CP</td>
                        <td>{props.current.priceInfo.upperCP}</td>
                        <td>52-wk high</td>
                        <td>{props.current.priceInfo.weekHighLow.max.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Low</td>
                        <td>{props.current.priceInfo.intraDayHighLow.min.toFixed(2)}</td>
                        <td></td>
                        <td></td>
                        <td>52-wk low</td>
                        <td>{props.current.priceInfo.weekHighLow.min.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default ChartFooter;