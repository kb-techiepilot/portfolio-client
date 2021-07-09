import React from 'react';
import Skeleton from 'react-loading-skeleton';

function HoldingsSkeleton(){

    return (
        <table className="highlight white responsive-table">
            <thead>
                <tr>
                    <th><Skeleton/></th>
                    <th><Skeleton/></th>
                    <th><Skeleton/></th>
                    <th><Skeleton/></th>
                    <th><Skeleton/></th>
                    <th><Skeleton/></th>
                    <th><Skeleton/></th>
                    <th><Skeleton/></th>
                    <th className="revert" style={{"width": "8%"}}>
                        <Skeleton/>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>
                        <div>
                            <span className="holdings-name text-15 font-medium"><Skeleton/></span>
                        </div>
                    </td>
                    <td><Skeleton/></td>  
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
    )
};

export default HoldingsSkeleton;