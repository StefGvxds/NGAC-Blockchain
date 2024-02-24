import React from "react";
import "./Box7_ShowProhibitions.css";
import "../../Parts/BoxStyle/BoxStyle.css";
import ShowProhibitions from "./ShowProhibitions.js";
import "../../Parts/Scrollbar/Scrollbar.css";


function Box7_ShowProhibitions(props) {
  return (
    <div id="scrollbar" className="Show-Resources-GUI">
      Prohibitions
      <ShowProhibitions prohibitionss={props.prohibitionss} />
    </div>
  );
}

export default Box7_ShowProhibitions;