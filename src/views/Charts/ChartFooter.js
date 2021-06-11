import React from 'react';

function ChartFooter(props){

    return(
        <>
        <div className="col s4">
            <table>
            <tbody>
                <tr>
                <td>Open</td>
                <td>{props.current.priceInfo.open.toFixed(2)}</td>
                </tr>
                <tr>
                <td>High</td>
                <td>{props.current.priceInfo.intraDayHighLow.max.toFixed(2)}</td>
                </tr>
                <tr>
                <td>Low</td>
                <td>{props.current.priceInfo.intraDayHighLow.min.toFixed(2)}</td>
                </tr>
            </tbody>
            </table>
        </div>
        <div className="col s4">
            <table>
            <tbody>
                {/* <tr>
                <td>Sector</td>
                <td>{props.current.metadata.pdSectorInd}</td>
                </tr> */}
                <tr>
                <td>Low CP</td>
                <td>{props.current.priceInfo.lowerCP}</td>
                </tr>
                <tr>
                <td>High CP</td>
                <td>{props.current.priceInfo.upperCP}</td>
                </tr>
            </tbody>
            </table>
        </div>
        <div className="col s4">
            <table>
            <tbody>
                <tr>
                <td>Prev close</td>
                <td>{props.current.priceInfo.previousClose.toFixed(2)}</td>
                </tr>
                <tr>
                <td>52-wk high</td>
                <td>{props.current.priceInfo.weekHighLow.max.toFixed(2)}</td>
                </tr>
                <tr>
                <td>52-wk low</td>
                <td>{props.current.priceInfo.weekHighLow.min.toFixed(2)}</td>
                </tr>
            </tbody>
            </table>
        </div>
        </>
    );
}

export default ChartFooter;