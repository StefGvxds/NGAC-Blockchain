import React, { useState, useEffect } from "react";
import "./ShowProhibitions.css";

function ShowProhibitions(props) {

  //Format prohibitions output: Delete "prohibitions: " and add after ")," a new line "\n"
  let formattedProhibitions = [];
  if (props.prohibitionss) {
    let prohibitionsString = props.prohibitionss.toString();
    let prohibitionsWithoutHeader = prohibitionsString.replace(/prohibitions:\s*/i, "");
    let prohibitionsSplit = prohibitionsWithoutHeader.split("),");

    formattedProhibitions = prohibitionsSplit.map((prohibition, index) => {
      return <span key={index}>{prohibition}{index !== prohibitionsSplit.length - 1 ? ")," : ""}<br/></span>;
    });
  }

  return (
    <div className="contractBox">
      <div id="title">Prohibitions:</div>
      <br />
      <div id="txt">{formattedProhibitions}</div>
      <br />
    </div>
  );
}
export default ShowProhibitions;
