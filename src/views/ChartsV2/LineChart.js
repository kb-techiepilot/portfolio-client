import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Chart from 'react-apexcharts';
// import ApexCharts from 'apexcharts';
import M from 'materialize-css';

import Loading from '../../components/Loading';
import config from '../../config';
import IntraDayChart from './IntraDayChart';
import ChartHeader from './ChartHeader';
import ChartFooter from './ChartFooter';

function LineChart(props) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [intraDay, setIntraDay] = useState([]);
  const [current, setCurrent] = useState();
  const [previousPrice, setPreviousPrice] = useState(0);

  const [currLoading,setCurrLoading] = useState(true);

  const[timeLine, setTimeLine] = useState("one_year");

  const btnClass = "btn white black-text btn-group-border";
  const btnClassWithActive = "btn white black-text btn-group-border btn-group-active-border";

  useEffect(()=> {
    var elems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(elems, {});
  })

  useEffect(() => {
    setLoading(true);
    var startDate = moment.unix('-2993523744');
    var endDate = moment();

    if(timeLine !== 'one_day'){

      switch(timeLine) {
        case "five_days" :
            startDate = moment().startOf('day').subtract(5, 'day');
            break;
        case "one_month" :
            startDate = moment().startOf('day').subtract(1, 'month');
            break;
        case "six_months":
            startDate = moment().startOf('day').subtract(6, 'month');
            break;
        case "ytd":
            startDate = moment("01 Jan " + moment().year()).startOf('day');
            break;
        case "one_year":
            startDate = moment().startOf('day').subtract(1, 'year');
            break;
        case "five_years":
            startDate = moment().startOf('day').subtract(5, 'year');
            break;
        default:
            break;
      }
      startDate = Math.floor((startDate.toDate().getTime())/1000);
      endDate = Math.floor((endDate.toDate().getTime())/1000);

      function history(){
        axios
        .get('https://priceapi.moneycontrol.com/techCharts/techChartController/history?symbol=' + props.symbol + '&resolution=1D&from=' + startDate + '&to=' + endDate, {
            })
        .then(res => {
          setHistory(res.data);
          setPreviousPrice(res.data.c[0]);
          setLoading(false);
            })
        .catch(err =>{
          console.log(err.message);
        });
      }
      props.symbol && history();
    }
  },[props.symbol, timeLine]);

  useEffect(() => {
    setLoading(true);
    if(timeLine === 'one_day' || timeLine === 'one_year') {

      function getIntraday(){
        axios
        .get(config.apiBaseUrl+"/api/v1/symbols/intraday", {
            params: {
                'symbol': props.symbol,
            }})
        .then(res => {
            setIntraDay(res.data);
            setPreviousPrice(res.data.current.priceInfo.previousClose);
            setLoading(false);
            })
        .catch(err =>{
          console.log(err.message);
        });
      }
      props.symbol && getIntraday();
    }
  },[props.symbol, timeLine]);

  useEffect(() => {
    setCurrLoading(true);
    function getCurrent() {
      axios
      .get(config.apiBaseUrl+"/api/v1/symbols/current", {
          params: {
              'symbol': props.symbol,
          }})
      .then(res => {
          setCurrent(res.data);
          setCurrLoading(false);
          })
      .catch(err =>{
        console.log(err.message);
      });
    }
    props.symbol && getCurrent();
  },[props.symbol]);
    

  function getLineData(history) {
      var data = []
      var dataObj = {};
      var responseData = [];
      var arr = [];
      if(history !== undefined && history.c !== undefined) {
        for (var i = 0; i < history.c.length; i++) {
          data = [moment.unix(history.t[i]).format("YYYY-MM-DD"), history.c[i]];
          arr.push(data);
          data = [];
        }

        dataObj.name = props.symbol;
        dataObj.data = arr;
        responseData.push(dataObj);
      }
      return responseData;
  }

  var lineOptions = {
      chart: {
        id: 'area-datetime',
        type: 'area',
        width: '20%',
        height: '10%'
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

  return(
      <>
      <div className="flex-apart">
        <div className="btn-group" role="group">
            <a className={timeLine === 'one_day' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="one_day">1D</a>
            <a className={timeLine === 'five_days' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="five_days">5D</a>
            <a className={timeLine === 'one_month' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="one_month">1M</a>
            <a className={timeLine === 'six_months' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="six_months">6M</a>
            <a className={timeLine === 'ytd' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="ytd">YTD</a>
            <a className={timeLine === 'one_year' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="one_year">1Y</a>
            <a className={timeLine === 'five_years' ? btnClassWithActive : btnClass } href="#!" onClick={(event) => updateTimeLine(event)} name="five_years">5Y</a>
        </div>
        <label className="tooltipped" data-position="top" data-tooltip="close">
          <i class="material-icons modal-close">close</i>
        </label>
      </div>
      {current !== undefined && current.priceInfo !== undefined && 
        <ChartHeader current={current} previousClosing={previousPrice} timeLine={timeLine} loading={currLoading}/>
      }
      <div className="row">
          <div id="chart">
              <div id="chart-timeline">
                  {!(loading || currLoading) ? 
                  timeLine === 'one_day' ?
                  intraDay !== undefined &&
                  <IntraDayChart chartId="shareChart" symbol={props.symbol} history={intraDay} previousClose={previousPrice} lastPrice={intraDay.current.priceInfo.lastPrice} />
                  :
                  <Chart options={lineOptions}
                      series={getLineData(history)}
                      type="area" />
                      :
                      <Loading />
                  }
              </div>
          </div>
      </div>
      {current !== undefined && current.priceInfo !== undefined && 
        <ChartFooter current={current} previousClosing={previousPrice} timeLine={timeLine}/>
      }
      </>
  )
}


//https://priceapi.moneycontrol.com/techCharts/intra?symbol=PURVA&resolution=1&from=1624320000&to=1624350427


export default LineChart;