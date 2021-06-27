import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import SummaryCards from './SummaryCards';
// import News from './News';
import IndexCards from './IndexCards';
import IndexChart from './IndexChart';
// import DonutChart from './DonutChart';
import Gainers from './Gainers/Gainers';
import Transactions from './Transactions';

function Dashboard(){
    const { isAuthenticated } = useAuth0();

    return(
        <main>
            <div>
                <IndexCards/>
            </div>
            {isAuthenticated ? 
                <SummaryCards/>
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

