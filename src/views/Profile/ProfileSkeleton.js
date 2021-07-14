import React, {useState, useEffect} from 'react';
import Skeleton from 'react-loading-skeleton';

function ProfileSkeleton(){
    return(
        <div>
            <div className="row">
                <div className="content-wrapper-before blue-grey lighten-5"></div>
                <div className="col s12">
                    <div className="container">
                        <section className="wishlist-wrapper section">

                            <div className="left mb-2">
                                <h4 className="blue-text">Profile</h4>
                            </div>
                            <div class="w-cd-hdr-box">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                        <tr>
                                            <td style={{"vertical-align":"top", "position":"relative", "width":"9.5rem"}}>
                                                <div class="logo-box">
                                                    <div class=""><Skeleton height={200}/></div>
                                                </div>
                                            </td>
                                            <td class="vat">
                                                <div class="cp-name-box">
                                                    {/* <div class="label"></div> */}
                                                    <div class="cname"><Skeleton/></div>
                                                </div>
                                                <div class="cp-info-box">
                                                    <ul>
                                                        <li>
                                                            <div class="icon-box"> <i class="material-icons"><Skeleton/></i></div>
                                                            <div class="label-box">
                                                                <div class="label-name"><Skeleton/></div>
                                                                <div class="label-text"><Skeleton/></div>
                                                            </div>
                                                        </li>
                                                        <li class="w30"><div class="vline"></div></li>
                                                        <li>
                                                            <div class="icon-box"> <i class="material-icons"><Skeleton/></i></div>
                                                            <div class="label-box">
                                                                <div class="label-name"><Skeleton/></div>
                                                                <div class="label-text"><Skeleton/></div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="w-cd-body-box">
                                <div class="section-title-box">
                                    <span class="title"><Skeleton/></span>
                                    <div className="right mb-2">
                                        <i className="material-icons"><Skeleton/></i>
                                    </div>
                                </div>
                                <div class="cp-info-box">
                                    <table className="highlight white">
                                        <thead>
                                            <tr>
                                                <th style={{"width": "10%"}}><Skeleton/></th>
                                                <th style={{"width": "10%"}}><Skeleton/></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td><Skeleton/></td>
                                                <td className="right"><Skeleton/></td>
                                                
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td><Skeleton/></td>
                                                <td className="right"><Skeleton/></td>
                                                
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td><Skeleton/></td>
                                                <td className="right"><Skeleton/></td>
                                                
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td><Skeleton/></td>
                                                <td className="right"><Skeleton/></td>
                                                
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td><Skeleton/></td>
                                                <td className="right"><Skeleton/></td>
                                                
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td><Skeleton/></td>
                                                <td className="right"><Skeleton/></td>
                                                
                                            </tr>
                                            <tr>
                                                <td><Skeleton/></td>
                                                <td><Skeleton/></td>
                                                <td className="right"><Skeleton/></td>
                                                
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>	
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ProfileSkeleton;