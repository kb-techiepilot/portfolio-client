import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import SummaryCards from './SummaryCards';
import ShareChart from '../Charts/ShareChart';
// import ContributionChart from './ContributionChart';
import News from './News';

function Dashboard(){
    const { isAuthenticated } = useAuth0();

    return(
        <div>
            {isAuthenticated ? 
                <SummaryCards/>
            :
                <></>
            }
            <div className="row">
                <div className="col s12 m8">
                    <div className="card animate fadeUp card-height">            
                        <ShareChart/>
                    </div>
                </div>
                <div className="col s12 m4">
                    <div className="card animate fadeUp card-height">
                    {/* <ContributionChart/> */}
                        <News />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;