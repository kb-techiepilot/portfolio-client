import React, {useEffect} from 'react';
import M from 'materialize-css';

function ChartFooter(props){

    useEffect(()=> {
        var elems = document.querySelectorAll('.carousel');
        M.Carousel.init(elems, {
            numVisible: 1,
            fullWidth: true,
            indicators: false,
            noWrap: true
        });
    });

    return(
        <>
        <div className="hide-on-med-and-down">
            <table className = "highlight">
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
        </div>
            <div className="carousel hide-on-med-and-up">
                <table className = "footer-table carousel-item highlight">
                    <tbody>
                        <tr className="mobile-tr">
                            <td>Open</td>
                            <td>High</td>
                            <td>Low</td>
                            <td>Low CP</td>
                        </tr>
                        <tr>
                            <td>{props.current.priceInfo.open.toFixed(2)}</td>
                            <td>{props.current.priceInfo.intraDayHighLow.max.toFixed(2)}</td>
                            <td>{props.current.priceInfo.intraDayHighLow.min.toFixed(2)}</td>
                            <td>{props.current.priceInfo.lowerCP}</td>
                        </tr>
                    </tbody>
                </table>
                <table className = "footer-table carousel-item highlight">
                    <tbody>
                        <tr className="mobile-tr">
                            <td>High CP</td>
                            <td>52-wk high</td>
                            <td>52-wk low</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{props.current.priceInfo.upperCP}</td>
                            <td>{props.current.priceInfo.weekHighLow.max.toFixed(2)}</td>
                            <td>{props.current.priceInfo.weekHighLow.min.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ChartFooter;