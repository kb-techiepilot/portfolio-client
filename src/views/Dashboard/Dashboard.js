import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import SummaryCards from './SummaryCards';
// import News from './News';
import IndexCards from './IndexCards';
import IndexChart from './IndexCharts/IndexChart';
import DonutChart from './DonutChart.js/DonutChart';

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
                    <div className="card animate fadeUp card-height">            
                        <IndexChart/>
                    </div>
                </div>
                <div className="col s12 m4">
                </div>
            </div>
            {isAuthenticated &&
                <div className="row">
                    <div className="col s12 m6">
                        <div className="card animate fadeUp card-height">            
                            <DonutChart/>
                        </div>
                    </div>
                    <div className="col s12 m6">
                        <div className="card animate fadeUp card-height">            
                            <DonutChart/>
                        </div>
                    </div>
                </div>
            }
        </main>
    )
};

export default Dashboard;