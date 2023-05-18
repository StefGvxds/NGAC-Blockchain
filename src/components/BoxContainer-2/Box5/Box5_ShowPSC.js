import React from "react";
import "./Box5_ShowPSC.css";
import "../../Parts/BoxStyle/BoxStyle.css";
import ShowPSC from "./ShowPSC.js";
import "../../Parts/Scrollbar/Scrollbar.css";

function Box5_ShowPSC(props) {
  return (
    <div id="scrollbar" className="Show-PSC-GUI">
      PSC
      <ShowPSC
        PSCaddr={props.PSCaddr}
        pscInstance={props.pscInstance}
      />
    </div>
  );
}

export default Box5_ShowPSC;
