import React from "react";
import "./Box6_ShowPrivileges.css";
import "../../Parts/BoxStyle/BoxStyle.css";
import ShowPrivileges from "./ShowPrivileges.js";
import "../../Parts/Scrollbar/Scrollbar.css";


function Box6_ShowPrivileges(props) {
  return (
    <div id="scrollbar" className="Show-Resources-GUI">
      Privileges
      <ShowPrivileges privilegess={props.privilegess} />
    </div>
  );
}

export default Box6_ShowPrivileges;
