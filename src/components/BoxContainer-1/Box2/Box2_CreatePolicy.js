import React, { useState, useEffect } from "react";
import "./Box2_CreatePolicy.css";
import "../../Parts/Scrollbar/Scrollbar.css";
import TextOverInput from "../../Parts/TextOverInput/TextOverInput.js";
import testText from "../../Parts/testText/testText.css";
//import PSC from "../../../SmartContracts/PSC/PSC.js";
import Web3 from "../../../web3.js";
import { abiPSC, bytecodePSC } from "../../../SmartContracts/PSC/PSC.js";
import DATSC from "../../../SmartContracts/DATSC/DATSC.js";

function Box2_CreatePolicy(props) {
  //LOAD PSC When LOGIN
  useEffect(() => {
    if (props.walletAddress) {
      loadPSC();
    }
  }, [props.walletAddress, props.updateCounter]);

  //_____________________________________________DEPLOY PSC__________________________________//
  //Save deployed PSC address
  const [savPSCaddr, setsavPSCaddr] = useState("");
  //Deploy PSC
  const deployContract = async () => {
    if (typeof window.ethereum !== "undefined") {
      props.setMSG("Deploying PSC...");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      //Save Provider
      const fromAddress = props.walletAddress;

      // Create new instance (With PSC ABI)
      console.log("ABI: ", abiPSC);
      console.log("Web3 : ", Web3.eth);
      const contractInstance = new Web3.eth.Contract(abiPSC);

      //Set constructor parameter (here not nessecary)
      const constructorParams = []; // example: ['param1', 'param2']

      // Calc Gasprice for deploying PSC
      const gasEstimate =
        (await contractInstance
          .deploy({
            data: "0x" + bytecodePSC,
            arguments: constructorParams,
            //estimateGas *2 because there will be an error if the gasprice is to low
          })
          .estimateGas()) * 2;

      // Deploy Smart Contract
      await contractInstance
        .deploy({
          data: "0x" + bytecodePSC,
          arguments: constructorParams,
        })
        .send({
          from: fromAddress,
          gas: gasEstimate,
        })
        .on("transactionHash", (transactionHash) => {
          console.log("Transaction Hash:", transactionHash);
        })
        .on("receipt", (receipt) => {
          console.log("Receipt:", receipt);
          console.log("Deployed Contract Address:", receipt.contractAddress);
          //save deployed PSC address
          setsavPSCaddr(receipt.contractAddress);
        })
        .on("error", (error) => {
          console.error("Error:", error);
        });
      //Set PSC
      setPSCInstance();
      getPSC();
      getPrivileges();
    } else {
      alert("Please install MetaMask and try again.");
    }
    props.setMSG("PSC is Deployed! Please click on Save Deployed PSC!");
  };
  //______________________________________________________SAVE PSC_________________________________//
  const saveDeployedPSC = async () => {
    if (savPSCaddr) {
      props.setMSG("Saving PSC...");
      try {
        await DATSC.methods
          .addPSC(savPSCaddr)
          .send({ from: props.walletAddress });
        props.setMSG("PSC saved!");
      } catch (error) {
        props.setMSG("Failed to save PSC: " + error.message);
      }
      setPSCInstance();
      getPSC();
      getPrivileges();
    } else {
      props.setMSG("Deploy first a PSC");
    }
  };

  //__________________________________________________CREATE PSC INSTANCE______________________________//

  const [PSC, setPSC] = useState("");

  const setPSCInstance = async () => {
    const pscAddress = await DATSC.methods
      .getPSC()
      .call({ from: props.walletAddress });
    if (pscAddress && pscAddress.length > 0) {
      setPSC(new Web3.eth.Contract(abiPSC, pscAddress));
      return true;
    }
    return false;
  };

  const loadPSC = async () => {
    props.setMSG("LOADING PSC...");
    try {
      const result = await setPSCInstance();
      if (!result) {
        props.setMSG("No PSC Deployed. Please Deploy one");
      } else {
        props.setMSG("Finished!");
      }
    } catch (error) {
      props.setMSG("Error: " + error.message);
    }
  };

  //LOAD PSC When LOGIN
  useEffect(() => {
    if (PSC) {
      getPSC();
      getPrivileges();
    }
  }, [PSC]);

  //SEND PSC ADDRESS --> App.js
  useEffect(() => {
    if (PSC) {
      const pscAddress = PSC.options.address;
      props.setPSCaddr(pscAddress);
    }
  }, [PSC]);

  //ATTRIBUTES__________________________________________________________

  //Create Attribute Array
  const [attributeList, setAttributeList] = useState([
    { attr: "", val: "" },
    { attr: "", val: "" },
  ]);

  //Update Attributes
  const handleAttributeChange = (e, index) => {
    const list = [...attributeList];
    list[index][e.target.name] = e.target.value;
    setAttributeList(list);
  };

  //Remove Attribute
  const handleRemoveAttribute = (index) => {
    const list = [...attributeList];
    list.splice(index, 1);
    setAttributeList(list);
  };

  //Add more Inputfields(Attribute, Value)
  const handleAddAttribute = () => {
    setAttributeList([...attributeList, { attr: "", val: "" }]);
  };

  //ASSIGNMENT__________________________________________________________

  //Create Assignment Array
  const [assignmentList, setAssignmentList] = useState([
    { attrA_name: "", attrA_value: "", attrB_name: "", attrB_value: "" },
  ]);

  //Update Assignment on change
  const handleAssignmentChange = (e, index) => {
    const list = [...assignmentList];
    list[index][e.target.name] = e.target.value;
    setAssignmentList(list);
  };

  //Remove Assignment
  const handleRemoveAssignment = (index) => {
    const list = [...assignmentList];
    list.splice(index, 1);
    setAssignmentList(list);
  };

  //Add more Assignment inputfields
  const handleAddAssignment = () => {
    setAssignmentList([
      ...assignmentList,
      { attrA_name: "", attrA_value: "", attrB_name: "", attrB_value: "" },
    ]);
  };

  //ASSOCIATIONS__________________________________________________________

  //Create Assignment Array
  const [associationList, setAssociationList] = useState([
    {
      attrA_assoc_name: "",
      attrA_assoc_value: "",
      accessRight: "",
      attrB_assoc_name: "",
      attrB_assoc_value: "",
    },
  ]);

  //Update Assignment on change
  const handleAssociationChange = (e, index) => {
    const list = [...associationList];
    list[index][e.target.name] = e.target.value;
    setAssociationList(list);
  };

  //Remove Assignment
  const handleRemoveAssociation = (index) => {
    const list = [...associationList];
    list.splice(index, 1);
    setAssociationList(list);
  };

  //Add more Assignment inputfields
  const handleAddAssociation = () => {
    setAssociationList([
      ...associationList,
      {
        attrA_assoc_name: "",
        attrA_assoc_value: "",
        accessRight: "",
        attrB_assoc_name: "",
        attrB_assoc_value: "",
      },
    ]);
  };

  //Reset All inputfields adter PSC creation___________________________________
  const resetAllInputFields = () => {
    //Reset Add Attribute fields
    setAttributeList([
      { attr: "", val: "" },
      { attr: "", val: "" },
    ]);
    //Reset Add Assignment fields
    setAssignmentList([
      { attrA_name: "", attrA_value: "", attrB_name: "", attrB_value: "" },
    ]);
    //Reset Add Association fields
    setAssociationList([
      {
        attrA_assoc_name: "",
        attrA_assoc_value: "",
        accessRight: "",
        attrB_assoc_name: "",
        attrB_assoc_value: "",
      },
    ]);
  };

  //Create PSC by click on Button__________________________________________________________

  const createPSC = () => {
    //Check if Wallet is connected
    if (!props.walletAddress) {
      props.setMSG("Connect first to Wallet");
    } else {
      //Checks that all Attribute fields are filled
      const attrIsFilled = attributeList.every(
        (item) => item.attr !== "" && item.val !== ""
      );

      //Checks that all Assignment fields are filled
      const assignmentIsFilled = assignmentList.every(
        (item) =>
          item.attrA_name !== "" &&
          item.attrA_value !== "" &&
          item.attrB_name !== "" &&
          item.attrB_value !== ""
      );
      //Checks that all Association fields are filled
      const associationIsFilled = associationList.every(
        (item) =>
          item.attrA_assoc_name !== "" &&
          item.attrA_assoc_value !== "" &&
          item.accessRight !== "" &&
          item.attrB_assoc_name !== "" &&
          item.attrB_assoc_value !== ""
      );

      //If some fields are empy return message to user
      if (!attrIsFilled && !assignmentIsFilled && !associationIsFilled) {
        props.setMSG("You have to fill all the input fields");
      } else if (!attrIsFilled) {
        props.setMSG("You have to fill all the Attribute fields");
        return;
      } else if (!assignmentIsFilled) {
        props.setMSG("You have to fill all the Assignment fields");
      } else if (!associationIsFilled) {
        props.setMSG("You have to fill all the Association fields");
      } else {
        //Call create PSC function
        crPSC(attributeList, assignmentList, associationList);
      }
    }
  };

  //Function to create PSC________________________________________________
  const crPSC = async (attributeList, assignmentList, associationList) => {
    //View all important information (for test purposes)
    console.log("Step 1. WalletAddress: ", props.walletAddress);
    console.log("Step 2. Provider: ", props.provider.toString());
    console.log("Step 3. PSC: ", PSC);
    //Check if the attributeList contains all important informations
    for (let i = 0; i < attributeList.length; i++) {
      console.log(
        "Step 4. Attribute ",
        i,
        "is: ",
        attributeList[i].attr,
        "Value ",
        i,
        "is: ",
        attributeList[i].val
      );
    }
    //Check if the assignmentList contains all important informations
    for (let i = 0; i < assignmentList.length; i++) {
      console.log(
        "Step 5. Assignment --> ",
        i,
        "AttrA name: ",
        assignmentList[i].attrA_name,
        "AttrA value: ",
        assignmentList[i].attrA_value,
        "AttrB name: ",
        assignmentList[i].attrB_name,
        "AttrB value: ",
        assignmentList[i].attrB_value
      );
    }
    //Check if the associationList contains all important informations
    for (let i = 0; i < associationList.length; i++) {
      console.log(
        "Step 6. Association --> ",
        i,
        "AttrA name: ",
        associationList[i].attrA_assoc_name,
        "AttrA value: ",
        associationList[i].attrA_assoc_value,
        "AccessRight: ",
        associationList[i].accessRight,
        "AttrB name: ",
        associationList[i].attrB_assoc_name,
        "AttrB value: ",
        associationList[i].attrB_assoc_value
      );
    }

    if (!props.provider) {
      console.log("Provider not defined Error");
    } else if (!PSC) {
      console.log("PSC not defined Error");
    } else {
      //________________________________________ATTRIBUTE SPLIT_____________________________________________//
      // Convert attributeList to separate arrays for attribute names and values
      //Because of: We have in Solidity a struct Attrubute [String attrName, String attrValue]
      //So we gave two arrays to combine them to one in Solidity
      const attributeListAttrNames = attributeList.map((item) => item.attr);
      const attributeListAttrValues = attributeList.map((item) => item.val);
      //Check attributeListAttrNames Array
      for (let i = 0; i < attributeListAttrNames.length; i++) {
        console.log(
          "Step 7. attributeListAttrNames: ",
          i,
          "is: ",
          attributeListAttrNames[i]
        );
      }
      //Check attributeListAttrValues Array
      for (let i = 0; i < attributeListAttrValues.length; i++) {
        console.log(
          "Step 8. attributeListAttrValues: ",
          i,
          "is: ",
          attributeListAttrValues[i]
        );
      }

      //________________________________________ASSIGNMENT SPLIT_____________________________________________//
      // Convert assignmentList to separate arrays (attrA, attrB)
      // And also seperate AttrA and AttrB to AttrA(name, value) and AttrB(name, value)

      //_______________________ATTR A________________________//
      //________AttrA name________//

      let assignmentListAttrNames_A = assignmentList.map(
        (item) => item.attrA_name
      );

      //Check assignmentListAttrNames_A Array
      for (let i = 0; i < assignmentListAttrNames_A.length; i++) {
        console.log(
          "Step 9. assignmentListAttrNames_A: ",
          i,
          "is: ",
          assignmentListAttrNames_A[i]
        );
      }

      //________AttrA value________//
      let assignmentListAttrValues_A = assignmentList.map(
        (item) => item.attrA_value
      );

      //Check assignmentListAttrValues_A Array
      for (let i = 0; i < assignmentListAttrValues_A.length; i++) {
        console.log(
          "Step 10. assignmentListAttrValues_A: ",
          i,
          "is: ",
          assignmentListAttrValues_A[i]
        );
      }

      //_______________________ATTR B________________________//
      //________AttrB name________//
      let assignmentListAttrNames_B = assignmentList.map(
        (item) => item.attrB_name
      );

      //Check assignmentListAttrNames_B Array
      for (let i = 0; i < assignmentListAttrNames_B.length; i++) {
        console.log(
          "Step 11. assignmentListAttrNames_B: ",
          i,
          "is: ",
          assignmentListAttrNames_B[i]
        );
      }

      //________AttrB value________//
      let assignmentListAttrValues_B = assignmentList.map(
        (item) => item.attrB_value
      );

      //Check assignmentListAttrValues_B Array
      for (let i = 0; i < assignmentListAttrValues_B.length; i++) {
        console.log(
          "Step 12. assignmentListAttrValues_B: ",
          i,
          "is: ",
          assignmentListAttrValues_B[i]
        );
      }

      // //________________________________________ASSOCIATION SPLIT_____________________________________________//
      // // Convert associationList to separate arrays (attrA, accessRight, attrB)
      // // And also seperate AttrA and AttrB to AttrA(name, value) and AttrB(name, value)

      // //_______________________ATTR A________________________//
      // //________AttrA name________//
      let associationListAttrNames_A = associationList.map(
        (item) => item.attrA_assoc_name
      );

      //Check associationListAttrNames_A Array
      for (let i = 0; i < associationListAttrNames_A.length; i++) {
        console.log(
          "Step 13. associationListAttrNames_A: ",
          i,
          "is: ",
          associationListAttrNames_A[i]
        );
      }

      //________AttrA value________//
      let associationListAttrValues_A = associationList.map(
        (item) => item.attrA_assoc_value
      );

      //Check associationListAttrValues_A Array
      for (let i = 0; i < associationListAttrValues_A.length; i++) {
        console.log(
          "Step 14. associationListAttrValues_A: ",
          i,
          "is: ",
          associationListAttrValues_A[i]
        );
      }

      // //_______________________ACCESSRIGHTS________________________//
      let associationAccesRights = associationList.map(
        (item) => item.accessRight
      );

      //Check associationAccesRights Array
      for (let i = 0; i < associationAccesRights.length; i++) {
        console.log(
          "Step 15. associationAccesRights: ",
          i,
          "is: ",
          associationAccesRights[i]
        );
      }

      // //_______________________ATTR B________________________//
      // //________AttrB name________//
      let associationListAttrNames_B = associationList.map(
        (item) => item.attrB_assoc_name
      );

      //Check associationListAttrNames_B Array
      for (let i = 0; i < associationListAttrNames_B.length; i++) {
        console.log(
          "Step 16. associationListAttrNames_B: ",
          i,
          "is: ",
          associationListAttrNames_B[i]
        );
      }

      //________AttrB value________//
      let associationListAttrValues_B = associationList.map(
        (item) => item.attrB_assoc_value
      );

      //Check associationListAttrValues_B Array
      for (let i = 0; i < associationListAttrValues_B.length; i++) {
        console.log(
          "Step 17. associationListAttrValues_B: ",
          i,
          "is: ",
          associationListAttrValues_B[i]
        );
      }

      //Now we export all this created arrays into the PSC
      props.setMSG("Creating PSC...");

      //Test if there is any error with callok
      let callOK = true;

      try {
        await PSC.methods
          .executePSC(
            //________Attribute__________//
            attributeListAttrNames,
            attributeListAttrValues,
            //________Assignment__________//
            assignmentListAttrNames_A,
            assignmentListAttrValues_A,
            assignmentListAttrNames_B,
            assignmentListAttrValues_B,
            //________Association__________//
            associationListAttrNames_A,
            associationListAttrValues_A,
            associationAccesRights,
            associationListAttrNames_B,
            associationListAttrValues_B
          )
          .call({ from: props.walletAddress });
      } catch (error) {
        callOK = false;
        seterrerr(error.message);
        console.log(errerr.split("{")[0].trim());
        props.setMSG(errerr.split("{")[0].trim());
      }
      if (callOK) {
        await PSC.methods
          .executePSC(
            //________Attribute__________//
            attributeListAttrNames,
            attributeListAttrValues,
            //________Assignment__________//
            assignmentListAttrNames_A,
            assignmentListAttrValues_A,
            assignmentListAttrNames_B,
            assignmentListAttrValues_B,
            //________Association__________//
            associationListAttrNames_A,
            associationListAttrValues_A,
            associationAccesRights,
            associationListAttrNames_B,
            associationListAttrValues_B
          )
          .send({ from: props.walletAddress });
        getPSC();
        getPrivileges();
        props.setMSG("PSC Created!");
      }
    }
  };

  const [errerr, seterrerr] = useState("");

  //_____________________________________CATCH ERROR MESSAGES_____________________________________//

  // Errormessage for EVENT (CAN ONLY USE WITHOUT REQUIRE)
  const handleErrorPSC = () => {
    if (!PSC) {
      console.error("PSC is not initialized yet.");
      return;
    }

    PSC.getPastEvents(
      "StringEvent",
      {
        fromBlock: 0,
        toBlock: "latest",
      },
      function (error, events) {
        console.log(events);
      }
    ).then(function (events) {
      console.log(events);
    });
  };

  //DATSC ERRORMESSAGE CATCH
  useEffect(() => {
    const listenForEvents = async () => {
      const errorMSGEvent = DATSC.events.ErrorMSG({}, (error, event) => {
        if (error) {
          console.error(error);
          props.setMSG(error);
        } else {
          console.log("ERRORERRORERRORERROR");
          const errMsg = event.returnValues[0];
          console.log("Error message:", errMsg);
          props.setMSG(errMsg);
        }
      });

      // Make sure to unsubscribe when the component unmounts
      return () => {
        errorMSGEvent.unsubscribe();
      };
    };

    listenForEvents();
  }, []);

  // _____________________________PSC GETTERS_______________________________________
  //isClosed
  const isClosed = async () => {
    const showClosed = await PSC.methods
      .getClose()
      .call({ from: props.walletAddress });
    props.setMSG(showClosed);
  };

  const [curPSC, setCurPSC] = useState();

  const getPSC = async () => {
    setCurPSC(
      await PSC.methods.getAllPSC().call({ from: props.walletAddress })
    );
  };

  useEffect(() => {
    if (curPSC) {
      console.log(curPSC);
      props.getPSCInstance(curPSC);
    }
  }, [curPSC]);

  //_____________________________________GET PRIVILEGES_____________________________________//

  const [privileges, setPrivileges] = useState();

  useEffect(() => {
    if (privileges !== undefined) {
      console.log(privileges);
      console.log("BOX2");
      props.setprivilegess(privileges);
    }
  }, [privileges]);

  const getPrivileges = async () => {
    setPrivileges(
      await PSC.methods.getPrivileges().call({ from: props.walletAddress })
    );
  };

  return (
    <div className="Create-PSC-GUI" id="scrollbar">
      Create Policy
      {/* ATRIBUTES__________________________________________________________ */}
      <TextOverInput className="Add Attribute" />
      {/* ONLY FOR TEST REASONS____________________________________________________________________________________ */}
      {/* <div className="testText">{JSON.stringify(attributeList, null, 2)}</div> */}
      {attributeList.map((x, i) => {
        return (
          <div key={i}>
            <div>
              {/* Inputfields for Attribute and Value input */}
              <input
                className="text_1of2"
                type="text"
                placeholder="Attribute name"
                name="attr"
                value={x.attr}
                onChange={(e) => handleAttributeChange(e, i)}
              />
              <input
                className="text_2of2"
                type="text"
                placeholder="Attribute Value"
                name="val"
                value={x.val}
                onChange={(e) => handleAttributeChange(e, i)}
              />
            </div>

            <div>
              {/* If we have more then two Attribute inputfields add an close button */}
              {attributeList.length > 2 && (
                <div>
                  <button
                    className="ButtonX"
                    onClick={() => handleRemoveAttribute(i)}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div>
        <button className="generalButton" onClick={handleAddAttribute}>
          Add +1 Attribute
        </button>
      </div>
      {/* ASSIGNMENTS__________________________________________________________ */}
      <TextOverInput className="Add Assignment" />
      {/* ONLY FOR TEST REASONS____________________________________________________________________________________ */}
      {/* <div className="testText">{JSON.stringify(assignmentList, null, 2)}</div> */}
      {assignmentList.map((x, i) => {
        return (
          <div key={i}>
            <div className="inputContainer">
              {/* Inputfields for Attribute and Value input */}
              <input
                className="text_1of2Assign"
                type="text"
                placeholder="Attribute A name"
                name="attrA_name"
                value={x.attrA_name}
                onChange={(e) => handleAssignmentChange(e, i)}
              />
              <input
                className="text_2of2Assign"
                type="text"
                placeholder="Attribute A value"
                name="attrA_value"
                value={x.attrA_value}
                onChange={(e) => handleAssignmentChange(e, i)}
              />
            </div>
            <div className="inputContainer">
              {" "}
              <input
                className="text_1of2Assign"
                type="text"
                placeholder="Attribute B name"
                name="attrB_name"
                value={x.attrB_name}
                onChange={(e) => handleAssignmentChange(e, i)}
              />
              <input
                className="text_2of2Assign"
                type="text"
                placeholder="Attribute B value"
                name="attrB_value"
                value={x.attrB_value}
                onChange={(e) => handleAssignmentChange(e, i)}
              />{" "}
              <div className="goRight">
                {/* If we have more then one Assignment inputfields add an close button */}
                {assignmentList.length > 1 && (
                  <div>
                    <button
                      className="ButtonX"
                      onClick={() => handleRemoveAssignment(i)}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            </div>{" "}
          </div>
        );
      })}
      <div>
        <button className="generalButton" onClick={handleAddAssignment}>
          Add +1 Assignment
        </button>
      </div>
      {/* ASSOCIATIONS__________________________________________________________ */}
      <TextOverInput className="Add Association" />
      {/* ONLY FOR TEST REASONS____________________________________________________________________________________ */}
      {/* <div className="testText">{JSON.stringify(associationList, null, 2)}</div> */}
      {associationList.map((x, i) => {
        return (
          <div key={i}>
            <div>
              {/* Inputfields for Associations input */}
              <div>
                <input
                  className="text_1of2"
                  type="text"
                  placeholder="Attribute A name"
                  name="attrA_assoc_name"
                  value={x.attrA_assoc_name}
                  onChange={(e) => handleAssociationChange(e, i)}
                />
                <input
                  className="text_2of2"
                  type="text"
                  placeholder="Attribute A value"
                  name="attrA_assoc_value"
                  value={x.attrA_assoc_value}
                  onChange={(e) => handleAssociationChange(e, i)}
                />
              </div>
              <div>
                {" "}
                <input
                  className="textAccessrights"
                  type="text"
                  placeholder="Accessright"
                  name="accessRight"
                  value={x.accessRight}
                  onChange={(e) => handleAssociationChange(e, i)}
                />
              </div>
              <div>
                {" "}
                <input
                  className="text_1of2"
                  type="text"
                  placeholder="Attribute B name"
                  name="attrB_assoc_name"
                  value={x.attrB_assoc_name}
                  onChange={(e) => handleAssociationChange(e, i)}
                />{" "}
                <input
                  className="text_2of2"
                  type="text"
                  placeholder="Attribute B value"
                  name="attrB_assoc_value"
                  value={x.attrB_assoc_value}
                  onChange={(e) => handleAssociationChange(e, i)}
                />
              </div>
            </div>

            <div>
              {/* If we have more then one Association inputfields add an close button */}
              {associationList.length > 1 && (
                <div>
                  <button
                    className="ButtonX"
                    onClick={() => handleRemoveAssociation(i)}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div>
        <button className="generalButton" onClick={handleAddAssociation}>
          Add +1 Association
        </button>
      </div>
      <div>_______________________</div>
      <div>
        <button className="generalButton" onClick={createPSC}>
          Create PSC
        </button>
      </div>
      <div>_______________________</div>
      <div>
        <button className="generalButton" onClick={deployContract}>
          Deploy PSC
        </button>
      </div>
      <div>
        <button className="generalButton" onClick={saveDeployedPSC}>
          Save Deployed PSC
        </button>
      </div>
      <div>_______________________</div>
      <div>
        <button className="generalButton" onClick={isClosed}>
          Check is Closed?
        </button>
      </div>
      <div>_______________________</div>
      <div>
        <button className="generalButton" onClick={getPrivileges}>
          Get Privileges
        </button>
      </div>
    </div>
  );
}

export default Box2_CreatePolicy;
