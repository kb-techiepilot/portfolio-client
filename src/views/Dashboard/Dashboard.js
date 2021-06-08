import React from 'react';
import SummaryCards from './SummaryCards';
import ShareChart from './ShareChart';
import ContributionChart from './ContributionChart';

function Dashboard(){

    return(
        <div>
            <SummaryCards/>
            <div className="row">
                <div class="col s12 m6 l6">
                    <ShareChart/>
                </div>
                <div class="col s12 m6 l6">
                    <ContributionChart/>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;