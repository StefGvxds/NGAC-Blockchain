import React, { useState, useEffect } from "react";
import "./BoxContainer_1.css";
import Box1_RegisterResource from "./Box1/Box1_RegisterResource.js";
import Box2_CreatePolicy from "./Box2/Box2_CreatePolicy.js";
import Box3_Access from "./Box3/Box3_Access.js";

function BoxContainer_1(props) {
  //Change message
  const changMSG = (msgInput) => {
    props.getMSG(msgInput);
  };

  return (
    <div className="Container-1">
      <Box1_RegisterResource
        setMSG={changMSG}
        provider={props.provider}
        walletAddress={props.walletAddress}
        //Take RSC DATA from Box1
        //addRSCToShowRSC={addRSCToShowRSC}
        //RSC
        chngRSCInstance={props.chngRSCInstance}
        setRSCaddr={props.setRSCaddr}
        //Update REACT
        updateCounter={props.updateCounter}
      />
      <Box2_CreatePolicy
        setMSG={changMSG}
        provider={props.provider}
        walletAddress={props.walletAddress}
        //PSC
        getPSCInstance={props.getPSCInstance}
        setPSCaddr={props.setPSCaddr}
        //Privileges
        setprivilegess={props.setprivilegess}
        //Prohibitions
        setprohibitionss={props.setprohibitionss}        
        //Update REACT
        updateCounter={props.updateCounter}
      />
      <Box3_Access 
      setMSG={changMSG} 
      provider={props.provider}
      walletAddress={props.walletAddress}
      updateCounter={props.updateCounter}
      />
    </div>
  );
}

export default BoxContainer_1;
