import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import moment from "moment";
import Chart from "react-apexcharts";

import Loading from '../../components/Loading';
import config from '../../config';

function LineChart(props) {
    const { getAccessTokenSilently } = useAuth0();

    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);


    useEffect(async () => {
        // setLoading(true);
        const token = await getAccessTokenSilently();

        axios
        .get(config.apiBaseUrl+"/api/v1/symbols/intraday", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
                'symbol': props.symbol,
            }})
        .then(res => {
            setHistory(res.data);
            if(res.data !== []) {
                setLoading(false);
            }
            })
        .catch(err =>{
          console.log(err.message);
        });
    },[props.symbol, props.timeLine]);
    

    function getLineData(history) {

        var responseData = []
        var dataObj = {};
        var data = [];
        // dataObj.data = history;
        
        var j = 1;
        data[0] = history[0];
        for(var i = 1; i < history.length-1; i++){
            if(history[i][0] - data[j-1][0] > 300000 ){
                data[j] = history[i];
                j++;
            }
        }
        dataObj.data = data;
        dataObj.name = props.symbol;
        responseData.push(dataObj);
        return responseData;
    }

    var lineOptions = {
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
        },
        tooltip: {
          x: {
            format: 'HH:mm'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
      }
    return(
        <>
        <div className="row">
            <div id="chart">
                <div id="chart-timeline">
                    {!loading ? 
                    <Chart options={lineOptions}
                        series={getLineData(history)}
                        type="area" height={350} />
                        :
                        <Loading />
                    }
                </div>
            </div>
        </div>
        </>
    )
}


export default LineChart;