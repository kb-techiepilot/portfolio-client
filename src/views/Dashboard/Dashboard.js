import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import SummaryCards from './SummaryCards';
import ShareChart from './ShareChart';
import ContributionChart from './ContributionChart';

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
                <div className="col s12 m6 l6">
                    <ShareChart/>
                </div>
                {/* <div className="col s12 m6 l6">
                    <ContributionChart/>
                </div> */}
            </div>
        </div>
    )
};

export default Dashboard;