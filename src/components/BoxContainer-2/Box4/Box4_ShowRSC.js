import React, { useState, useEffect } from "react";
import "./Box4_ShowRSC.css";
import "../../Parts/BoxStyle/BoxStyle.css";
import ShowRSC from "./ShowRSC.js";
import "../../Parts/Scrollbar/Scrollbar.css";

function Box4_ShowRSC(props) {
  let rscInstances = props.rscInstances;

  const extractUriAndAttributes = (data) => {
    const parts = data.split("; ");
    const uri = parts[0];
    const attributes = parts.slice(1).map((attr) => {
      const [name, value] = attr.split(": ");
      return { name, value };
    });
    console.log("Extracted data:", { uri, attributes });
    return { uri, attributes };
  };

  return (
    <div id="scrollbar" className="Show-RSC-GUI">
      RSC
      {rscInstances.map((instance, index) => {
        const { uri, attributes } = extractUriAndAttributes(instance);
        return (
          <ShowRSC
            key={index}
            uri={uri}
            attributes={attributes}
            index={index}
            RSCaddr={props.RSCaddr}
          />
        );
      })}
    </div>
  );
}

export default Box4_ShowRSC;
