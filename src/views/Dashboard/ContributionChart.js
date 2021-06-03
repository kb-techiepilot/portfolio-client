import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function ContributionChart() {
    const { getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);

    const [contr, setContr] = useState({});

    useEffect(async () => {
        const token = await getAccessTokenSilently();
        axios
        .get("http://localhost:2000/api/v1/summary/chart", {
            headers: {
              Authorization: `Bearer ${token}`,
            }})
        .then(res => {
          setContr(res.data);
          setLoading(false);
        })
        .catch(err =>{
          console.log(err.message);
        });
    },[]);

    function getData(contribution) {
        var label = [];
        var value = [];
        contribution.forEach(ele => {
            label.push(ele.symbol);
            value.push(ele.percentage);
        });
        const datasets = [];
        const dataObj = {};
        dataObj.data = value;
        dataObj.fill = true;
        dataObj.backgroundColor = "rgba(75,192,192,0.2)";
        dataObj.borderColor = "rgba(75,192,192,1)";
        dataObj.label = "";
        datasets.push(dataObj);

        const data = {};
        data.labels = label;
        data.datasets = datasets;
        return data;
    }

    return(
        <>

        <div id="revenue-chart" className="card animate fadeUp">
            <div className="card-content">
                <h4 className="header mt-0">
                    Holdings Contribution
                    <span className="purple-text small text-darken-1 ml-1">
                        {/* <i className="material-icons">keyboard_arrow_up</i> */}
                    </span>
                </h4>
                <div className="row">
                    <div className="col s12">
                        { !loading ?
                        <Line data={getData(contr)}/>
                        : <></> }
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ContributionChart;