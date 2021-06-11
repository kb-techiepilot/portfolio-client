import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Loading from '../../components/Loading';
import config from '../../config';
import moment from 'moment';

function News() {
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);

    useEffect(() => {

        axios
        .get(config.apiBaseUrl+"/api/v1/news")
        .then(res => {
            setLoading(false);
            setNews(res.data.articles);
            })
        .catch(err =>{
          console.log(err.message);
        });
    },[]);

    function getTimeDuration(dateTime) {
        var momentDate = moment(dateTime);
        return moment.duration(moment().diff(momentDate)).asHours().toFixed(0) + " hours ago";
    }
    return(
        <>
        
            <div className="card-content">
                <h4 className="header m-0">Recent Tit Bits
                </h4>
                
                {news.map(news => <div className="card horizontal">
                    <div className="card-image">
                        <img className="mb4 news-img text-15 font-medium" src={news.urlToImage} alt="News Img" />
                    </div>
                    <div className="card-stacked">
                        <div className="card-content">
                            <div>
                                <a className="news-title" href={news.url} target="_blank">{news.title}</a>
                            </div>
                            <p class="jsx-2138398116 text-13 news-info lh-157">
                                <span class="jsx-2138398116 ">
                                    {getTimeDuration(news.publishedAt)}
                                </span>
                                <span class="jsx-2138398116 news-info-separator">
                                    •
                                </span>
                                <span class="jsx-2138398116 ">
                                    {news.source.name}
                                </span>
                            </p>
                        </div>
                    </div>
                    </div>)}
            </div>
        </>
    );
};

export default News;