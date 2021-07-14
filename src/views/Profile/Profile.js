import React, {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import M from 'materialize-css';
import { BarLoader } from 'react-spinners';

import config from '../../config';
import moment from 'moment';
import ProfileSkeleton from './ProfileSkeleton';

function Profile(){

    const { getAccessTokenSilently } = useAuth0();
    const [profile, setProfile] = useState({});
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [preLoader, setPreloader] = useState(false);
    const [reload, setReload] = useState(false);
    const [brokerId, setBrokerId] = useState(0);

    useEffect(() => {
        async function fetchProfile() {
            const token = await getAccessTokenSilently();
                axios
                .get(config.apiBaseUrl+"/api/v2/profile",{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }},{ validateStatus: false })
                .then(res => {
                    setLoading(false);
                    setProfile(res.data);
                })
                .catch(err =>{
                console.log(err.message);
                });
        }
        fetchProfile();
    },[getAccessTokenSilently, reload]);

    async function addBroker(event){
        setPreloader(true);
        const token = await getAccessTokenSilently();
        var param = {
            name : name,
            url : url,
        };
        axios
        .post(config.apiBaseUrl+"/api/v2/broker", param, {
            headers: {
            Authorization: `Bearer ${token}`,
            }},{ validateStatus: false })
        .then(res => {
            setPreloader(false);
            setReload(!reload);
            setDisabled(true);
            setName("");
            setUrl("");
            M.toast({html: 'add broker success!'},{
                displayLength: 4000
            });
        })
        .catch(err =>{
            M.toast({html: ''+err.response.data.message},{
                displayLength: 4000
            });
        });
    }

    async function updateBroker(event, id){
        setPreloader(true);
        const token = await getAccessTokenSilently();
        var param = {
            name : name,
            url : url,
        };
        axios
        .post(config.apiBaseUrl+"/api/v2/broker/"+id, param, {
            headers: {
            Authorization: `Bearer ${token}`,
            }},{ validateStatus: false })
        .then(res => {
            setPreloader(false);
            setReload(!reload);
            setDisabled(true);
            setBrokerId(0);
            setName("");
            setUrl("");
            M.toast({html: 'update broker success!'},{
                displayLength: 4000
            });
        })
        .catch(err =>{
        console.log(err.message);
        });
    }

    function openBrokerModal(event){

        setBrokerId(0);
        event.preventDefault();
        var elems = document.querySelectorAll('#broker-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();
    }

    function openWithDefaultValue(event, id, name, url){
        setBrokerId(id);
        setName(name);
        setUrl(url);
        event.preventDefault();
        var elems = document.querySelectorAll('#broker-modal');
        M.Modal.init(elems, {});
        elems[0].M_Modal.open();

    }

    function changeName(event){
        setName(event.target.value);
        setDisabled(false);
    }

    function changeURL(event){
        setUrl(event.target.value);
        setDisabled(false);
    }


    return(
        <main>
            <div>
                {loading ? 
                <ProfileSkeleton/>
                :
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
                                                        <div class="logo"><img className="" src={profile.picture} alt="" /></div>
                                                    </div>
                                                </td>
                                                <td class="vat">
                                                    <div class="cp-name-box">
                                                        {/* <div class="label"></div> */}
                                                        <div class="cname">{profile.name}</div>
                                                    </div>
                                                    <div class="cp-info-box">
                                                        <ul>
                                                            <li>
                                                                <div class="icon-box"> <i class="material-icons">email</i></div>
                                                                <div class="label-box">
                                                                    <div class="label-name">Email ID</div>
                                                                    <div class="label-text">{profile.email}</div>
                                                                </div>
                                                            </li>
                                                            <li class="w30"><div class="vline"></div></li>
                                                            <li>
                                                                <div class="icon-box"> <i class="material-icons">date_range</i></div>
                                                                <div class="label-box">
                                                                    <div class="label-name">Joined On</div>
                                                                    <div class="label-text">{moment(profile.created_on).format("DD-MM-YYYY HH:mm:ss")}</div>
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
                                        <span class="title">Brokers</span>
                                        <div className="right mb-2">
                                            <a className="gradient-45deg-purple-deep-orange gradient-shadow btn-floating pulse" href="#!" onClick={(event) => openBrokerModal(event)}>
                                                <i className="material-icons">add</i>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="cp-info-box">
                                        <table className="highlight white">
                                            <thead>
                                                <tr>
                                                    <th style={{"width": "10%"}}>Name</th>
                                                    <th style={{"width": "10%"}}>URL</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {profile.brokers && profile.brokers.map((broker, index) => 
                                                <tr key={index}>
                                                    <td>{broker.name}</td>
                                                    <td><a href={broker.url} target="_blank" rel="noreferrer">{broker.url}</a></td>
                                                    <td className="right"><i className="material-icons" onClick={(event) => openWithDefaultValue(event, broker.broker_id, broker.name, broker.url)}>edit</i></td>
                                                    
                                                </tr>)}
                                            </tbody>
                                        </table>
                                    </div>	
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                }
            </div>

            <div id="broker-modal" className="modal wd-450 top-30">

                <BarLoader loading={preLoader} width={"100%"} />
                <div data-id="1" data-order="1" className="kanban-board">
                    <header className="kanban-board-header blue">
                        <div className="row">
                            <div className="col s8 kanban-title-board line-ellipsis">
                                <span>{brokerId > 0 ? 'Update Broker' : 'Add Broker'}</span>
                            </div>
                        </div>
                    </header>
                    <div className="kanban-drag">
                        <div className="kanban-item">
                            <div className="row">
                                <div className="input-field col s6">
                                    <input id="name" defaultValue={brokerId > 0 ? name : ""} type="text" className="validate" onChange={(event) => changeName(event)}/>
                                    <label className="active" htmlFor="qty">Name</label>
                                </div>
                                <div className="input-field col s6">
                                    <input id="url" defaultValue={brokerId > 0 ? url : ""} type="text" className="validate" onChange={(event) => changeURL(event)}/>
                                    <label className="active" htmlFor="qty">URL</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s6">
                                    {brokerId > 0 ?
                                        <span disabled={disabled} className="btn waves-effect yellow losers-head" onClick={(event) => updateBroker(event, brokerId)}>Update</span> 
                                        :
                                        <span disabled={disabled} className="btn waves-effect yellow losers-head" onClick={(event) => addBroker(event)}>Add</span> 
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    )
};

export default Profile;