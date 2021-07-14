import React, {useState, useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import M from 'materialize-css';
import axios from 'axios';

import SummaryCards from './SummaryCards';
import IndexCards from './IndexCards';
import IndexChart from './IndexChart';
// import DonutChart from './DonutChart';
import Gainers from './Gainers/Gainers';
import Transactions from './Transactions';
import config from '../../config';

function Dashboard(){
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);
    const [brokers, setBrokers] = useState({});
    const [broker, setBroker] = useState(-1);


    useEffect(() => {

        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    })

    useEffect(()=> {
        async function fetchBroker() {
            setLoading(true);
            const token = await getAccessTokenSilently();
            axios
            .get(config.apiBaseUrl+"/api/v2/broker",{
                headers: {
                Authorization: `Bearer ${token}`,
                }},{ validateStatus: false })
            .then(res => {
                setBrokers(res.data);
                setBroker(res.data[0].broker_id)
                setLoading(false);
            })
            .catch(err =>{
            console.log(err.message);
            });
        }
        isAuthenticated && fetchBroker();
    },[getAccessTokenSilently, isAuthenticated]);

    function changeBroker(event){
        setBroker(event.target.value);
        event.preventDefault();
    }

    return(
        <main>
            <div>
                <IndexCards/>
            </div>
            {isAuthenticated ? 
                <div>

                <div className="row">
                    <div className="input-field col offset-s8 s4">
                        <select onChange={(event) => changeBroker(event)}>
                            <option value="-1">All</option>
                            {!loading && brokers.map((broker, index) => 
                                <option value={broker.broker_id}>{broker.name}</option>
                            )}
                        </select>
                        {/* <label>Select Broker</label> */}
                    </div>
                </div>
                <SummaryCards broker={broker}/>
                </div>
            :
                <></>
            }
            <div className="row">
                <div className="col s12 m8">
                    <div className="card animate fadeUp">            
                        <IndexChart/>
                    </div>
                </div>
                <div className="col s12 m4">
                    <div className="card animate fadeUp card-m-height-565">            
                        <Gainers/>
                    </div>
                </div>
            </div>
            {isAuthenticated &&
                <div className="row">
                    <div className="col s12 m12">
                        <Transactions />
                    </div>
                </div>
            }
                            {/* <div className="row">
                    <div className="col s12 m6">
                        <div className="card animate fadeUp">            
                            <DonutChart/>
                        </div>
                    </div>
                    <div className="col s12 m6">
                        <div className="card animate fadeUp">            
                            <DonutChart/>
                        </div>
                    </div>
                </div> */}
        </main>
    )
};

export default Dashboard;

