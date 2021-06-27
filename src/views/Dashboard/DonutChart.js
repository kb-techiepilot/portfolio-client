import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useAuth0 } from '@auth0/auth0-react';

import config from '../../config';

function DonutChart() {

    const { getAccessTokenSilently } = useAuth0();
    const [series, setSeries] = useState([]);
    const [labels, setLabels] = useState([]);


    useEffect(() => {
        async function fetchSummary() {
            const token = await getAccessTokenSilently();
            axios
            .get(config.apiBaseUrl+"/api/v2/summary/chart", {
                headers: {
                Authorization: `Bearer ${token}`,
                }})
            .then(res => {
                const seriesArr = [];
                const labelsArr = [];
                res.data.forEach(data => {
                    seriesArr.push(Number(data.percentage));
                    labelsArr.push(data.index)
                })
                setSeries(seriesArr);
                setLabels(labelsArr);
            })
            .catch(err =>{
            console.log(err.message);
            });
        }
        fetchSummary();
    },[getAccessTokenSilently]);

    function getOptions(){
        const lineProps = {
            
            series: series,
            options: {
                chart: {
                width: 380,
                type: 'donut',
                },
                title: {
                    text: 'Index Distribution'
                },
                legend: {
                    show: false,
                },
                labels: labels,
                noData: {
                    text: "Add holdings to see data",
                    align: 'center',
                    verticalAlign: 'middle',
                    style: {
                      color: 'black',
                      fontSize: '20px',
                      fontFamily: undefined
                    }
                  }
            }
        }
        return lineProps;
    }

    return(
        <>
        {/* <div className="card-content"> */}
            {series !== undefined && 
            <Chart options={getOptions().options}
                      series={getOptions().series}
                      type="donut" width={380} />
            }
        {/* </div> */}
        </>
    )
};

export default DonutChart