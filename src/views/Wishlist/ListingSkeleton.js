import React from 'react';
import Skeleton from 'react-loading-skeleton';

function ListingSekelton() {

    return (
        <table className="highlight white">
            <thead>
                <tr>
                    <th style={{"width": "25%"}}><Skeleton/></th>
                    <th className="hide-on-small-only" style={{"width": "15%"}}><Skeleton/></th>
                    <th style={{"width": "12%"}}><Skeleton/></th>
                    <th style={{"width": "12%"}}><Skeleton/></th>
                    <th style={{"width": "12%"}}><Skeleton/></th>
                    <th className="hide-on-small-only">
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
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                </tr>
                <tr>
                    <td><Skeleton/></td> 
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                </tr>
                <tr>
                    <td><Skeleton/></td> 
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                </tr>
                <tr>
                    <td><Skeleton/></td> 
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                </tr>
                <tr>
                    <td><Skeleton/></td> 
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                </tr>
                <tr>
                    <td><Skeleton/></td> 
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                </tr>
                <tr>
                    <td><Skeleton/></td> 
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td><Skeleton/></td>
                    <td className="hide-on-small-only"><Skeleton/></td>
                    <td><Skeleton/></td>
                </tr>
                
            </tbody>
        </table>
    )
}

export default ListingSekelton;