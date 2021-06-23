import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

import Loading from '../../components/Loading';
import config from '../../config';
import IntraDayChart from './IntraDayChart';
import ChartHeader from './ChartHeader';
import ChartFooter from './ChartFooter';

function LineChart(props) {

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [intraDay, setIntraDay] = useState([]);
  const [previousPrice, setPreviousPrice] = useState(0);

  const[timeLine, setTimeLine] = useState("one_year");

  const btnClass = "btn white black-text btn-group-border";
  const btnClassWithActive = "btn white black-text btn-group-border btn-group-active-border";


  useEffect(() => {

    setLoading(true);
    var startDate = moment().subtract(1, 'year').format("YYYY-MM-DD");
    var endDate = moment().format("YYYY-MM-DD");

    axios
    .get(config.apiBaseUrl+"/api/v2/history/" + props.symbol, {
        params: {
            'start': startDate,
            'end': endDate
        }})
    .then(res => {
        setLoading(false);
        setHistory(res.data);
        })
    .catch(err =>{
      console.log(err.message);
    });
  },[props.symbol]);

  useEffect(() => {
    axios
    .get(config.apiBaseUrl+"/api/v1/symbols/intraday", {
        params: {
            'symbol': props.symbol,
        }})
    .then(res => {
        setIntraDay(res.data);
        })
    .catch(err =>{
      console.log(err.message);
    });
  },[props.symbol]);
    

  function getLineData(history) {
      var dataObj = {};
      var responseData = [];
      dataObj.data = history.history !== undefined && history.history;
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
        },
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
          format: 'dd-MM-yyyy'
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
      colors: ['#3ABB5D'],
    }

    function updateTimeLine(event) {
      event.preventDefault();
      setTimeLine(event.target.name);
    }

    function getPreviousPrice(date) {
      if(history.history !== undefined && timeLine === 'one_day') {
        setPreviousPrice(history.current.priceInfo.previousClose);
      } else {
        console.log(history.history.length);
        history.history !== undefined && history.history.forEach(ele => {
          if(date === ele[0]) {
            setPreviousPrice(ele[1]);
          }
        });
      }
    }

    useEffect(() => {
      if(history.history !== undefined) {
        var startDate = moment().subtract(1, 'year');
        var endDate = moment().format("DD MMM YYYY");
        if(timeLine === 'one_year') {
            ApexCharts.exec(
                'area-datetime',
                'resetSeries'
            );
        }
        else if(timeLine !== 'one_day'){
          switch(timeLine) {
            case "five_days" :
                startDate = moment().subtract(5, 'day').format("DD MMM YYYY");
                break;
            case "one_month" :
                startDate = moment().subtract(1, 'month').format("DD MMM YYYY");
                break;
            case "six_months":
                startDate = moment().subtract(6, 'month').format("DD MMM YYYY");
                break;
            case "ytd":
                startDate = "01 Jan " + moment().year();
                break;
            default:
                break;
              }
                  
            startDate = moment(startDate);
            console.log(startDate.day() + "-----" + startDate.format("YYYY-MM-DD"));
            if(startDate.day() === 6) {
              startDate = startDate.add(2, 'day');
            } else if(startDate.day() === 0) {
                startDate = startDate.add(1, 'day');
            }
            ApexCharts.exec(
                'area-datetime',
                'zoomX',
                new Date(startDate.format("DD MMM YYYY")).getTime(),
                new Date(endDate).getTime()
            );
        }
        startDate = moment(startDate);
        if(startDate.day() === 6) {
          startDate = startDate.add(2, 'day');
        } else if(startDate.day() === 0) {
            startDate = startDate.add(1, 'day');
        }
        getPreviousPrice(startDate.format("YYYY-MM-DD"));

      }
    });
  return(
      <>
      <div className="btn-group" role="group">
          <a className={timeLine === 'one_day' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="one_day">1D</a>
          <a className={timeLine === 'five_days' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="five_days">5D</a>
          <a className={timeLine === 'one_month' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="one_month">1M</a>
          <a className={timeLine === 'six_months' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="six_months">6M</a>
          <a className={timeLine === 'ytd' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="ytd">YTD</a>
          <a className={timeLine === 'one_year' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="one_year">1Y</a>
      </div>
      {history.current !== undefined ? 
        <ChartHeader current={history.current} previousClosing={previousPrice} timeLine={timeLine}/>
      :
      <></>
      }
      <div className="row">
          <div id="chart">
              <div id="chart-timeline">
                  {!loading ? 
                  timeLine === 'one_day' ?
                  <IntraDayChart symbol={props.symbol} history={intraDay} />
                  :
                  <Chart options={lineOptions}
                      series={getLineData(history)}
                      type="area" height={350} />
                      :
                      <Loading />
                  }
              </div>
          </div>
      </div>
      {history.current !== undefined ?
        <ChartFooter current={history.current} previousClosing={previousPrice} timeLine={timeLine}/>
      :
      <></>
      }
      </>
  )
}


export default LineChart;