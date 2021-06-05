import React from 'react';
import { PulseLoader } from 'react-spinners';
import { css } from '@emotion/react';

const override = css`
        display: block;
        margin: 10 !important;
        border-color: red;
        padding: 32px;
    `;

const Loading = () => (
  
  <div className="container center padding-15">
    <PulseLoader loading={true} css={override} size={15} />
  </div>
);

export default Loading;
