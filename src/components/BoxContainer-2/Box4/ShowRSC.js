import React, { useState, useEffect } from "react";
import "./ShowRSC.css";

function showRSC(props) {
  
  const { uri, attributes } = props;

  // const handleDeleteClick = () => {
  //   props.callDeleteRSC(props.index);
  // };

  return (
    <div className="contractBox">
      <p id="title">Index: {props.index}</p>
      <br />
      <p id="title">RSC ADDRESS:</p>
      <br />
      <p id="txt">{props.RSCaddr}</p>
      <br />
      <p id="title">RSC URI:</p>
      <br />
      <p id="txt">{uri}</p>
      <br />
      <p id="title">RSC ATTRIBUTES: VALUES:</p>
      <br />
      {Array.isArray(attributes) &&
        attributes.map((attr, index) => (
          <p id="attrShow" key={index}>
            {attr.name}: {attr.value}
            <br />
          </p>
        ))}
      <br />
      {/* <button onClick={handleDeleteClick}>Delete RSC</button> */}
    </div>
  );
}
export default showRSC;
