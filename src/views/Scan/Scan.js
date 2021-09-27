import React, {useState, useEffect} from 'react';
import axios from 'axios';
import M from 'materialize-css';
import config from '../../config';
import moment from 'moment';

function Scan(){

    const [csrf, setCsrf] = useState("");
    const [cookie, setCookie] = useState("");
    const [stop, setStop] = useState(true);

    const [restData, setRestData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [diffData, setDiffData] = useState([]);
    const [lastUpdate, setLastUpdate] = useState("");

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

                var diffArr = [];
                var restArr = [];
                for(var i = 0; i < response.length; i++) {
                    var jsonObj = response[i];

                    if(!JSON.stringify(allData).includes(jsonObj.nsecode)){
                        diffArr.push(jsonObj);
                    } else {
                        restArr.push(jsonObj);
                    }
                }

                if(allData.length === 0 ) {
                    setAllData(response);
                }
                if(diffArr.length !== 0) {
                    setDiffData(diffArr);
                    setAllData(response);
                    setRestData(restArr);
                }
                setLastUpdate(moment().format("DD MM YYYY hh:mm:ss"));

            } else {
                alert('Enter Url');
            }
        }
        !stop && startScan();
        const intervalId = setInterval(() => { 
            !stop && startScan();
        }, 28000);
        return () => clearInterval(intervalId);
    },[stop, csrf, cookie, allData, diffData]);

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

                                {diffData.length > 0 &&
                                    <div>
                                    <h6>New Data - Last Updated at {lastUpdate}</h6>
                                        {diffData.map((diff, index) => 
                                            <div className="col s2">
                                                <div className="card">
                                                    <div className="card-content green white-text">
                                                        <div className="holdings-name text-15 font-medium">{diff.nsecode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                                {restData.length > 0 &&
                                    <div>
                                        {restData.map((all, index) => 
                                            <div className="col s2">
                                                <div className="card">
                                                    <div className="card-content white-text">
                                                        <div className="holdings-name text-15 font-medium">{all.nsecode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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