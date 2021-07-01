import React from 'react';
import Skeleton from 'react-loading-skeleton';

function ListingSekelton() {

    return (
        <div>
            <div className="row">
                <div className="content-wrapper-before blue-grey lighten-5"></div>
                <div className="col s12">
                    <div className="container">
                        <section className="wishlist-wrapper section">

                        <div className="left mb-2">
                            <h4 className="blue-text"><Skeleton/></h4>
                        </div>
                        <div className="right mb-2">
                            <Skeleton circle={true} height={40} width={40} />
                        </div>

                        <table className="highlight white responsive-table">
                        <thead>
                            <tr>
                                <th style={{"width": "25%"}}><Skeleton/></th>
                                <th style={{"width": "15%"}}><Skeleton/></th>
                                <th style={{"width": "12%"}}><Skeleton/></th>
                                <th style={{"width": "12%"}}><Skeleton/></th>
                                <th style={{"width": "12%"}}><Skeleton/></th>
                                <th className="">
                                    <span><Skeleton/></span>
                                </th>
                                <th className="revert" style={{"width": "8%"}}>
                                <Skeleton/>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                            <tr>
                                <td><Skeleton/></td> 
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                                <td><Skeleton/></td>
                            </tr>
                        </tbody>
                    </table>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingSekelton;