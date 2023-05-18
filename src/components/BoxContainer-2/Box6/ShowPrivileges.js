import React, { useState, useEffect } from "react";
import "./ShowPrivileges.css";

function ShowPrivileges(props) {

  //Format Privileges output: Delete "Privileges: " and add after ")," a new line "\n"
  let formattedPrivileges = [];
  if (props.privilegess) {
    let privilegesString = props.privilegess.toString();
    let privilegesWithoutHeader = privilegesString.replace(/privileges:\s*/i, "");
    let privilegesSplit = privilegesWithoutHeader.split("),");

    formattedPrivileges = privilegesSplit.map((privilege, index) => {
      return <span key={index}>{privilege}{index !== privilegesSplit.length - 1 ? ")," : ""}<br/></span>;
    });
  }

  return (
    <div className="contractBox">
      <div id="title">Privileges:</div>
      <br />
      <div id="txt">{formattedPrivileges}</div>
      <br />
    </div>
  );
}
export default ShowPrivileges;
