import React from 'react';
import SummaryCards from './SummaryCards';
import InvestmentChart from './InvestmentChart';
import ContributionChart from './ContributionChart';

function Dashboard(){

    return(
        <div>
            <SummaryCards/>
            <div className="row">
                <div class="col s12 m6 l12">
                    <InvestmentChart/>
                </div>
                {/* <div class="col s12 m6 l6">
                    <ContributionChart/>
                </div> */}
            </div>
        </div>
    )
};

export default Dashboard;