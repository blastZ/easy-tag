import React, { Component } from 'react';

const ImgBotBar = ({ taskstatus }) => (
  <div style={{width: '100%', position: 'absolute', bottom: 50, left: '0', zIndex: '10'}}>
    <div style={{position: 'absolute', bottom: 50, left: '10px', zIndex: '10'}}>
        <p className="w3-text-white">{`${taskstatus}`}</p>
    </div>
  </div>
)

export default ImgBotBar;