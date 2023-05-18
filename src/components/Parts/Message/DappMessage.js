import "./DappMessage.css";
import React, { useState } from "react";

function DappMessage(props) {
  return <div id="Alert">{props.setMSG}</div>;
}

export default DappMessage;
