import React, { useState, useEffect } from "react";
import "./ShowPSC.css";

function showPSC(props) {
  return (
    <div className="contractBox">
      <p id="title">PSC ADDRESS:</p>
      <br />
      <p id="txt">{props.PSCaddr}</p>
      <br />
      <p id="txt">
        {" "}
        {typeof props.pscInstance === "string" &&
          props.pscInstance.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
      </p>
    </div>
  );
}
export default showPSC;
