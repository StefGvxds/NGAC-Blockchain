import React, { useState, useEffect } from "react";
import "./Box1_RegisterResource.css";
import "../../Parts/Scrollbar/Scrollbar.css";
import "../../Parts/BoxStyle/BoxStyle.css";
import TextOverInput from "../../Parts/TextOverInput/TextOverInput.js";
import { abiRSC, bytecodeRSC } from "../../../SmartContracts/RSC/RSC.js";
import DATSC from "../../../SmartContracts/DATSC/DATSC.js";
import Web3 from "../../../web3.js";
import testText from "../../Parts/testText/testText.css";

function Box1_RegisterResource(props) {
  //LOAD RSC When LOGIN
  useEffect(() => {
    if (props.walletAddress) {
      loadRSC();
    }
  }, [props.walletAddress, props.updateCounter]);

  //_____________________________________________ TIME COUNTER __________________________________//
  const currentTime = new Date();

  //_____________________________________________DEPLOY RSC__________________________________//
  //Save deployed RSC address
  const [savRSCaddr, setsavRSCaddr] = useState("");
  //Deploy RSC
  const deployContract = async () => {
    console.clear();
    if (typeof window.ethereum !== "undefined") {
      props.setMSG("Deploying RSC...");

      //await window.ethereum.request({ method: "eth_requestAccounts" });
      await window.ethereum.request({ method: "eth_requestAccounts" });

      //Save Provider
      //If we dont have set account use this
      const fromAddress = props.walletAddress;

      // Create new instance (With RSC ABI)
      //console.log("ABI: ", abiRSC);
      //console.log("Web3 : ", Web3.eth);
      const contractInstance = new Web3.eth.Contract(abiRSC);

      //Set constructor parameter (here not nessecary)
      const constructorParams = []; // example: ['param1', 'param2']

      // Calc Gasprice for deploying RSC
      const gasEstimate =
        (await contractInstance
          .deploy({
            data: "0x" + bytecodeRSC,
            arguments: constructorParams,
            //estimateGas *2 because there will be an error if the gasprice is to low
          })
          .estimateGas()) * 2;

      //Set TIME when we want start count//
      const startTime = new Date();

      // Deploy Smart Contract
      await contractInstance
        .deploy({
          data: "0x" + bytecodeRSC,
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
          //console.log("Receipt:", receipt);
          //console.log("Deployed Contract Address:", receipt.contractAddress);
          //save deployed RSC address
          setsavRSCaddr(receipt.contractAddress);
        })
        .on("error", (error) => {
          console.error("Error:", error);
        });

      //Set TIME when we want to stop count//
      const endTime = new Date();
      //Calc the difference
      const timeInMilliSec = endTime - startTime;
      //Convert the time in hours, minutes, seconds, milliseconds
      const timeInSec = timeInMilliSec / 1000;
      const hours = Math.floor(timeInSec / 3600);
      const minutes = Math.floor((timeInSec % 3600) / 60);
      const seconds = Math.floor(timeInSec % 60);
      const milliseconds = (timeInMilliSec % 1000) / 1000; 

      console.log(`RSC is Deployed!! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);

    } else {
      alert("Please install MetaMask and try again.");
    }
    props.setMSG("RSC is Deployed! Please save Deployed RSC!");
  };

  //______________________________________________________SAVE RSC_________________________________//
  const saveDeployedRSC = async () => {
    console.clear();
    if (savRSCaddr) {
      props.setMSG("Saving RSC...");

      //Set TIME when we want start count//
      const startTime = new Date();

      try {
        await DATSC.methods
          .addRSC(savRSCaddr)
          .send({ from: props.walletAddress });

        //Set TIME when we want to stop count//
        const endTime = new Date();
        //Calc the difference
        const timeInMilliSec = endTime - startTime;
        //Convert the time in hours, minutes, seconds, milliseconds
        const timeInSec = timeInMilliSec / 1000;
        const hours = Math.floor(timeInSec / 3600);
        const minutes = Math.floor((timeInSec % 3600) / 60);
        const seconds = Math.floor(timeInSec % 60);
        const milliseconds = (timeInMilliSec % 1000) / 1000; 

        console.log(`RSC saved! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);

        props.setMSG("RSC saved!");

      } catch (error) {
        props.setMSG("Failed to save RSC: " + error.message);
      }
      setRSCInstance();
    } else {
      props.setMSG("Deploy first a RSC");
    }
  };

  //__________________________________________________CREATE RSC INSTANCE______________________________//
  const [RSC, setRSC] = useState("");

  const setRSCInstance = async () => {
    const rscAddress = await DATSC.methods
      .getRSC()
      .call({ from: props.walletAddress });
    if (rscAddress && rscAddress.length > 0) {
      const rsc = new Web3.eth.Contract(abiRSC, rscAddress);
      setRSC(rsc);
      return true;
    }
    return false;
  };

  //LOAD RSC DATA by every update
  useEffect(() => {
    if (RSC) {
      getRSCInstances();
    }
  }, [RSC]);

  const loadRSC = async () => {
    props.setMSG("LOADING RSC...");
    try {
      const result = await setRSCInstance();
      if (!result) {
        props.setMSG("No RSC Deployed. Please Deploy one");
      } else {
        //getRSCInstances();
        props.setMSG("Finished!");
      }
    } catch (error) {
      props.setMSG("Error: " + error.message);
    }
  };

  //SEND RSC ADDRESS --> App.js
  useEffect(() => {
    if (RSC) {
      const rscAddress = RSC.options.address;
      props.setRSCaddr(rscAddress);
    }
  }, [RSC]);

  //ATRIBUTES__________________________________________________________

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

  //Update URI_____________________________________
  const [uri, setUri] = useState("");
  const handleChangeURI = (event) => {
    setUri(event.target.value);
  };

  //Reset All inputfields after RSC creation
  const resetAllInputFields = () => {
    setUri("");
    setAttributeList([
      { attr: "", val: "" },
      { attr: "", val: "" },
    ]);
  };

  //Create RSC by click on Button__________________________________________________________

  const createRSC = () => {
    //Check if Wallet is connected
    if (!props.walletAddress) {
      props.setMSG("Connect first to Wallet");
    } else {
      //Checks that all Attribute fields are filled
      const attrIsFilled = attributeList.every(
        (item) => item.attr !== "" && item.val !== ""
      );

      //If some fields are empy return message to user
      if (!attrIsFilled && !uri) {
        props.setMSG("You have to fill all the Attributes and the URI");
      } else if (!attrIsFilled) {
        props.setMSG("You have to fill all the Attribute fields");
        return;
      } else if (!uri) {
        props.setMSG("You have to fill the URI field");
      } else {
        //Call create RSC function
        crRSC(uri, attributeList);
      }
    }
  };

  //Function to create RSC________________________________________________
  const crRSC = async (uriInput, attributeInput) => {
    console.clear();
    //console.log("WalletAddress: ", props.walletAddress);
    //console.log("Provider: ", props.provider.toString());
    //console.log("RSC: ", RSC);
    //console.log("URI: ", uri);
    // for (let i = 0; i < attributeList.length; i++) {
    //   console.log(
    //     "Attribute ",
    //     i,
    //     "is: ",
    //     attributeList[i].attr,
    //     "Value ",
    //     i,
    //     "is: ",
    //     attributeList[i].val
    //   );
    // }
    if (!props.provider) {
      console.log("Provider not defined Error");
    } else if (!RSC) {
      console.log("RSC not defined Error");
    } else {
      //CALL RSC METHODS____________________________________________________

      //TEST if there will be any error by calling the execute method
      let callOK = true;
      try {
        props.setMSG("Confirm RSC...");
        // Convert attributeList to separate arrays for attribute names and values
        //Because of: We have in Solidity a struct Attrubute [String attrName, String attrValue]
        //So we gave two arrays to combine them to one in Solidity
        const attrNames = attributeList.map((item) => item.attr);
        const attrValues = attributeList.map((item) => item.val);
        await RSC.methods
          .executeRSC(uri, attrNames, attrValues)
          .call({ from: props.walletAddress });
      } catch (error) {
        callOK = false;
        console.log(error);
        props.setMSG(error.message.split("{")[0].trim());
      }

      if (callOK) {
        props.setMSG("Confirm RSC...");
        // Convert attributeList to separate arrays for attribute names and values
        //Because of: We have in Solidity a struct Attrubute [String attrName, String attrValue]
        //So we gave two arrays to combine them to one in Solidity
        const attrNames = attributeList.map((item) => item.attr);
        const attrValues = attributeList.map((item) => item.val);

        //Set TIME when we want start count//
        const startTime = new Date();


        await RSC.methods
          .executeRSC(uri, attrNames, attrValues)
          .send({ from: props.walletAddress });

        //Set TIME when we want to stop count//
        const endTime = new Date();
        //Calc the difference
        const timeInMilliSec = endTime - startTime;
        //Convert the time in hours, minutes, seconds, milliseconds
        const timeInSec = timeInMilliSec / 1000;
        const hours = Math.floor(timeInSec / 3600);
        const minutes = Math.floor((timeInSec % 3600) / 60);
        const seconds = Math.floor(timeInSec % 60);
        const milliseconds = (timeInMilliSec % 1000) / 1000; 

        console.log(`Resource created! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);

        //show RSCInstances in Box4
        getRSCInstances();
        //Reset all inputfields
        resetAllInputFields();

        props.setMSG("Resource created!");
        //Save created RSC data____________________________________________
        const rscADDR = RSC.options.address;
      }
    }
  };

  //Save delete Index
  const [delindex, setDelindex] = useState(0);
  const handleDeleteIndexChange = (event) => {
    setDelindex(parseInt(event.target.value) || 0);
    //console.log(event.target.value);
  };

  //Delete selected RSC
  //parseInt secures that the delindex is an integer
  const deleteRSC = async (delindex) => {
    console.clear();
    props.setMSG("Please wait... Resource will be Deleted...");
    
    //Set TIME when we want start count//
    const startTime = new Date();

    await RSC.methods
      .deleteRSCInstance(delindex)
      .send({ from: props.walletAddress });

    //Set TIME when we want to stop count//
    const endTime = new Date();
    //Calc the difference
    const timeInMilliSec = endTime - startTime;
    //Convert the time in hours, minutes, seconds, milliseconds
    const timeInSec = timeInMilliSec / 1000;
    const hours = Math.floor(timeInSec / 3600);
    const minutes = Math.floor((timeInSec % 3600) / 60);
    const seconds = Math.floor(timeInSec % 60);
    const milliseconds = (timeInMilliSec % 1000) / 1000; 

    console.log(`Resource Deleted! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);

    //show RSCInstances in Box4
    getRSCInstances();
    props.setMSG("Resource Deleted!");
  };

  //__________________________________________SHOW FINISHED RSC_____________________________

  //Get all Attributes
  const getRSCInstances = async () => {
    const rscInstances = await RSC.methods
      .getRSCInstances()
      .call({ from: props.walletAddress });

    // for (let i = 0; i < rscInstances.length; i++) {
    //   console.log(rscInstances[i]);
    // }
    //Send RSC --> BoxContainer1
    props.chngRSCInstance(rscInstances);
  };

  //________________________Store RSC Address in DATSC_________________________________________
  const storeRSC = async () => {};

  return (
    <div className="Register-Resource-GUI" id="scrollbar">
      Register Resource
      <TextOverInput className="URI" />
      <form id="Input">
        <input
          className="textOne"
          type="text"
          value={uri}
          onChange={handleChangeURI}
          placeholder="Type URI..."
        />
      </form>
      <TextOverInput className="Add Attribute" />
      {/* https://www.cluemediator.com/add-or-remove-input-fields-dynamically-with-reactjs */}
      {attributeList.map((x, i) => {
        return (
          <div key={i}>
            <div>
              {/* Inputfields for Attribute and Value input */}
              <input
                className="text_1of2"
                type="text"
                placeholder="Type Attribute..."
                name="attr"
                value={x.attr}
                onChange={(e) => handleAttributeChange(e, i)}
              />
              <input
                className="text_2of2"
                type="text"
                placeholder="Type Value..."
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
          Add Attribute
        </button>
      </div>
      <div>
        <button className="generalButton" onClick={createRSC}>
          Create new Resource
        </button>
      </div>
      <div>
        <button className="generalButton" onClick={() => deleteRSC(delindex)}>
          Delete Resource
        </button>

        {/* Inputfields for Attribute and Value input */}
        <input
          className="textOne"
          type="number"
          min="0"
          placeholder="Delete RSC. Type index..."
          value={delindex}
          onChange={handleDeleteIndexChange}
        />
      </div>
      <div>
        <button className="generalButton" onClick={deployContract}>
          Deploy RSC
        </button>
      </div>
      <div>
        <button className="generalButton" onClick={saveDeployedRSC}>
          Save Deployed RSC
        </button>
      </div>
    </div>
  );
}

export default Box1_RegisterResource;
