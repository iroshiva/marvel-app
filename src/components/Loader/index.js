import React, { memo } from "react";
import './Loader.css';

const Loader = ({text, styling}) => {
  return (
    <>
      <div className="loader"></div>
      <p style={styling}>{text}</p>
    </>
  );
};

export default memo(Loader);
