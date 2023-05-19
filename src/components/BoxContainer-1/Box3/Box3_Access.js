import React, { useState, useEffect } from "react";
import "./Box3_Access.css";
import "../../Parts/BoxStyle/BoxStyle.css";
import TextOverInput from "../../Parts/TextOverInput/TextOverInput";
import DSC from "../../../SmartContracts/DSC/DSC.js";
import Web3 from "../../../web3.js";

function Box3_Access(props) {

  //Before execute access request is there any error?
  const [decision, setDecision] = useState(false);
  const requestDesicion = async () => {
    props.setMSG("Wait for answer!");
    if (!props.provider) {
      console.log("Provider not defined Error");
    } else if (!DSC) {
      console.log("DSC not defined Error");
    } else {
      let callOK = true;
      try {
        await DSC.methods
          .decision(uri, accessright, userAttributeName, userAttributeValue)
          .call({ from: props.walletAddress });
      } catch (error) {
        callOK = false;
        console.log(error);
        props.setMSG(error.message.split("{")[0].trim());
      }

      //If no ERROR execute access request
      if (callOK) {
        const decisionValue = await DSC.methods
          .decision(uri, accessright, userAttributeName, userAttributeValue)
          .call({ from: props.walletAddress });
      
        setDecision(decisionValue);
      
        if (decisionValue == true) {
          props.setMSG("Access succeed");
        } else {
          props.setMSG("Access denied");
        }
      }
    }
  };

  //______________________________DECISION INPUT________________________________//

  //CHANGE URI BY TYPING
  const [uri, setUri] = useState("");
  const handleChangeURI = (event) => {
    setUri(event.target.value);
  };

  //CHANGE Accessright BY TYPING
  const [accessright, setaccessright] = useState("");
  const handleChangeAccessRight = (event) => {
    setaccessright(event.target.value);
  };

  //CHANGE userAttributeNAME
  const [userAttributeName, setUserAttributeName] = useState("");
  const handleChangeUserAttributeName = (event) => {
    setUserAttributeName(event.target.value);
  };

  //CHANGE userAttributeVALUE
  const [userAttributeValue, setUserAttributeValue] = useState("");
  const handleChangeUserAttributeValue = (event) => {
    setUserAttributeValue(event.target.value);
  };

  //Change Dessicion message THIS IS ONLY FOR THE ASSIGNMENTWORK!!! NOT USE FOR REAL DESSICIONS!!!
  const [des, setdes] = useState("");
  const handleChangeDes = (event) => {
    setdes("Access denied");
    props.setMSG(des);
  };

  //PRINT ALL INPUT VALUES
  useEffect(() => {
    console.log("URI: ", uri);
    console.log("accessright: ", accessright);
    console.log("userAttributeName: ", userAttributeName);
    console.log("userAttributeValue: ", userAttributeValue);
  }, [uri, accessright, userAttributeName, userAttributeValue]);

  return (
    <div className="Request-Access-GUI">
      Access Request
      <TextOverInput className="URI" />
      <form id="Input">
        <input
          className="textOne"
          type="text"
          placeholder="Type URI..."
          value={uri}
          onChange={handleChangeURI}
        ></input>
      </form>
      <TextOverInput className="Accessright" />
      <form id="Input">
        <input
          className="textOne"
          type="text"
          placeholder="Type Accessright..."
          value={accessright}
          onChange={handleChangeAccessRight}
        ></input>
      </form>
      <TextOverInput className="User Attribute" />
      <form id="Input">
        <div className="User Attribute">
          {/* Inputfields for Attribute and Value input */}
          <input
            className="text_1of2"
            type="text"
            placeholder="Attribute Name"
            name="userAttributeName"
            value={userAttributeName}
            onChange={handleChangeUserAttributeName}
          />
          <input
            className="text_2of2"
            type="text"
            placeholder="Attribute Value"
            name="userAttributeValue"
            value={userAttributeValue}
            onChange={handleChangeUserAttributeValue}
          />
        </div>
      </form>
      <div>
        <button onClick={requestDesicion} className="Button">
          Request Access
        </button>
      </div>
    </div>
  );
}

export default Box3_Access;
