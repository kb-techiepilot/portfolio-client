import React from 'react';

function IndexCard() {

    return(
        <>
            <div className="card">
                <div className="card-content row">
                    <div className="col s3 center">
                        image
                    </div>
                    <div className="col s6">
                        <div className="row">
                        NIFTY MIDCAP 100
                        </div>
                        <div className="row">
                            share amount
                        </div>  
                    </div>
                    <div className="col s3">
                        <div className="row">
                            100%
                        </div>
                        <div className="row">
                            500
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default IndexCard;