import React, { useState, useEffect } from "react";
import "./BoxContainer_2.css";
import Box4_ShowRSC from "./Box4/Box4_ShowRSC.js";
import Box5_ShowPSC from "./Box5/Box5_ShowPSC.js";
import Box6_ShowPrivileges from "./Box6/Box6_ShowPrivileges.js";
import Box7_ShowProhibitions from "./Box7/Box7_ShowProhibitions.js";

function BoxContainer_2(props) {
  //Take RSC DATA to send them to Box4

  let rscInstances = props.rscInstances;

  return (
    <div className="Container-2">
      <Box4_ShowRSC
        //RSC
        rscInstances={rscInstances}
        RSCaddr={props.RSCaddr}
      />
      <Box5_ShowPSC
        //PSC
        pscInstance={props.pscInstance}
        PSCaddr={props.PSCaddr}
      />
      <Box6_ShowPrivileges privilegess={props.privilegess} />
      <Box7_ShowProhibitions prohibitionss={props.prohibitionss} />
    </div>
  );
}

export default BoxContainer_2;
