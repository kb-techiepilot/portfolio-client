import React from 'react';
import Skeleton from 'react-loading-skeleton';

function DetailSkeleton() {

    return(
        <div>
            <div className="card">
                <div className="card-content">
                    <span className="wishlist-card-title">
                        <Skeleton/>
                    </span>
                    <div className="row mrt-10">
                        <div className="wishlist-data col s6">
                            <div className="wishlist-symbol">
                        <Skeleton/>
                            </div>
                            <div className="wishlist-index">
                        <Skeleton/>
                            </div>
                        </div>
                        <div className="col s6">
                            <div className="wishlist-symbol wishlist-ta-rt">
                                <Skeleton/>
                            </div>
                            <div className="wishlist-index wishlist-ta-rt">
                                <Skeleton/>
                            </div>
                        </div>
                    </div>
                    <div className="row mrt-10">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    <Skeleton/>
                                </span>
                                <div className="row">
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            <Skeleton/>
                                        </div>
                                        <div className="wishlist-symbol">
                                            <Skeleton/>
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            <Skeleton/>
                                        </div>
                                        <div className="wishlist-symbol">
                                            <Skeleton/>
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            <Skeleton/>
                                        </div>
                                        <div className="wishlist-symbol">
                                            <Skeleton/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            <Skeleton/>
                                        </div>
                                        <div className="wishlist-symbol">
                                            <Skeleton/>
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            <Skeleton/>
                                        </div>
                                        <div className="wishlist-symbol">
                                            <Skeleton/>
                                        </div>
                                    </div>
                                    <div className="wishlist-data col s4">
                                        <div className="wishlist-index">
                                            <Skeleton/>
                                        </div>
                                        <div className="wishlist-symbol">
                                            <Skeleton/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                </div>
                                <div className="row mt-5">
                                    <div className="mb4 slider-pos relative wishlist-1D full-width">
                                        <span className="year-slider">
                                            <Skeleton/>
                                        </span>
                                    </div>
                                    <div className="flex-apart full-width wishlist-slider">
                                        <span><Skeleton/></span>
                                        <span><Skeleton/></span>
                                        <span><Skeleton/></span>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="mb4 slider-pos relative wishlist-52 full-width">
                                        <span className="year-slider">
                                            <Skeleton/>
                                        </span>
                                    </div>
                                    <div className="flex-apart full-width wishlist-slider">
                                        <span><Skeleton/></span>
                                        <span><Skeleton/></span>
                                        <span><Skeleton/></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row mrt-10">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    <Skeleton/>
                                </span>
                                <div className="flex-apart">
                                    <table className="market-depth white mrr-10">
                                        <thead className="market-depth-th">
                                            <tr>
                                                <th className="up"><Skeleton/></th>
                                                <th className="wishlist-ta-rt"><Skeleton/></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td className="wishlist-ta-rt"><Skeleton/></td>
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td className="wishlist-ta-rt"><Skeleton/></td>
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td className="wishlist-ta-rt"><Skeleton/></td>
                                            </tr>
                                            <tr>
                                                <th><Skeleton/></th>
                                                <th className="wishlist-ta-rt"><Skeleton/></th>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="market-depth white mrl-10">
                                        <thead className="market-depth-th">
                                            <tr>
                                                <th className="down"><Skeleton/></th>
                                                <th className="wishlist-ta-rt"><Skeleton/></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td className="wishlist-ta-rt"><Skeleton/></td>
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td className="wishlist-ta-rt"><Skeleton/></td>
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td className="wishlist-ta-rt"><Skeleton/></td>
                                            </tr>
                                            <tr>
                                                <th><Skeleton/></th>
                                                <th className="wishlist-ta-rt"><Skeleton/></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DetailSkeleton;