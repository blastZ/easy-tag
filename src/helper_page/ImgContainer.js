import React from 'react';

const ImgContainer = ({src, name}) => (
  <div>
    <img src={src} className="w3-image"/>
    { name && <p className="w3-center">{name}</p>}
  </div>
)

export default ImgContainer;
