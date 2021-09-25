import React, {useState, useEffect} from 'react';
import axios from 'axios';
import M from 'materialize-css';
import config from '../../config';
import moment from 'moment';

function Scan(){

    const [csrf, setCsrf] = useState("");
    const [cookie, setCookie] = useState("");
    const [stop, setStop] = useState(true);

    const [oldData, setOldData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [diffData, setDiffData] = useState([]);


    // useEffect(() => {
    //     async function startScan() {
    //         if(cookie !== "" && csrf !== "") {
    //             axios
    //             .get(config.apiBaseUrl+"/api/v2/scan", {
    //                 params: {
    //                     'cookie': cookie,
    //                     'csrf': csrf
    //                 }})
    //             .then(res => {
    //                 // console.log("response " + JSON.stringify(res.data.data));
    //                 setDiffData([]);
    //                 var diffArr = [];
    //                 var restArr = [];
    //                 for(var i = 0; i < res.data.data.length; i++){
    //                     var jsonObj = res.data.data[i];
    //                     if(!JSON.stringify(oldData).includes("\"nsecode\":\""+jsonObj.nsecode+"\"")){
    //                         diffArr.push(jsonObj);
    //                     } else {
    //                         restArr.push(jsonObj);
    //                     }
    //                 }
    //                 setDiffData(diffArr);
    //                 setOldData(res.data.data);
    //                 setNewData(restArr);
    //                 console.log("diffArr : -> " + diffArr);
    //                 console.log("restArr : -> " + restArr);
    //                 })
    //             .catch(err =>{
    //             console.log(err.message);
    //             });
    
    //         } else {
    //             alert('Enter Url');
    //         }
    //     }
    //     !stop && startScan();
    //     const intervalId = setInterval(() => { 
    //         !stop && startScan();
    //     }, 10000);
    //     return () => clearInterval(intervalId);
    // },[stop, cookie, csrf]);
    useEffect(() => {
        async function startScan() {
            if(cookie !== "" && csrf !== "") {
                const stocks = await axios.get(
                    config.apiBaseUrl+"/api/v2/scan", {
                    params: {
                        'cookie': cookie,
                        'csrf': csrf
                    }});
                var response = stocks.data.data;

                setDiffData(response);

            } else {
                alert('Enter Url');
            }
        }
        !stop && startScan();
        const intervalId = setInterval(() => { 
            !stop && startScan();
        }, 10000);
        return () => clearInterval(intervalId);
    },[stop, csrf, cookie]);

    function changeCSRF(event){
        setCsrf(event.target.value);
    }

    function changeCookie(event){
        setCookie(event.target.value);
    }

    function hitRequest(event){
        setStop(false);
    }

    function stopRequest(event){
        setStop(true);
    }
    return(
        <main>
            <div>
                <div className="row">
                    <div className="content-wrapper-before blue-grey lighten-5"></div>
                    <div className="col s12">
                        <div className="container">
                            <section className="wishlist-wrapper section">

                                <div className="left mb-2">
                                    <h4 className="blue-text">Scanner</h4>
                                </div>
                                <div class="w-cd-hdr-box">
                                    <div className="input-field col s6">
                                        <input id="cookie" defaultValue={cookie} type="text" className="validate" onChange={(event) => changeCookie(event)}/>
                                        <label className="active" htmlFor="cookie">Cookie</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="csrf" defaultValue={csrf} type="text" className="validate" onChange={(event) => changeCSRF(event)}/>
                                        <label className="active" htmlFor="csrf">CSRF</label>
                                    </div>
                                    {/* <span disabled={false} className="btn waves-effect yellow losers-head" onClick={(event) => hitRequest(event)}>Go</span> 
                                    <span disabled={false} className="btn waves-effect yellow losers-head" onClick={(event) => stopRequest(event)}>Stop</span>  */}

                                    <div className="row">
                                        <div className="col s7 flex-apart">
                                            <span className="btn waves-effect waves-green gainers-head" onClick={(event) => hitRequest(event)}>Go</span> 
                                            <span className="btn waves-effect waves-red losers-head" onClick={(event) => stopRequest(event)}>Stop</span> 
                                        </div>
                                    </div>
                                </div>

                                {diffData.length > 0 ?
                                    <table className="highlight white">
                                        <thead>
                                            <tr>
                                                <th style={{"width": "25%"}}>NSE Code</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {diffData.map((diff, index) => 
                                                <div className="col s2">
                                                        <div className="card">
                                                            <div className="card-content white-text">
                                                                <div className="holdings-name text-15 font-medium">{diff.nsecode}</div>
                                                            </div>
                                                        </div>
                                                    </div>)}
                                        </tbody>
                                    </table>

                                    :
                                    <div className="center mt-10">
                                        
                                    </div>

                                }
                            </section>
                        </div>
                    </div> 
                </div>
            </div>
        </main>
    );
}
export default Scan;