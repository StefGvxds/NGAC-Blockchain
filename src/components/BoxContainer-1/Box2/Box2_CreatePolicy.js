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


//_____________________________________________ TIME COUNTER __________________________________//
  const currentTime = new Date();

//___________________________________________ LOAD PSC When LOGIN
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
    console.clear();

    if (typeof window.ethereum !== "undefined") {
      props.setMSG("Deploying PSC...");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      //Save Provider
      const fromAddress = props.walletAddress;

      // Create new instance (With PSC ABI)
      //console.log("ABI: ", abiPSC);
      //console.log("Web3 : ", Web3.eth);
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
      
      //Set TIME when we want start count//
      const startTime = new Date();    

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
          //console.log("Transaction Hash:", transactionHash);
        })
        .on("receipt", (receipt) => {
          //console.log("Receipt:", receipt);
          //console.log("Deployed Contract Address:", receipt.contractAddress);
          //save deployed PSC address
          setsavPSCaddr(receipt.contractAddress);
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
      const milliseconds = (timeInMilliSec % 1000) / 1000; // Hier wird durch 1000 geteilt, um den Bruchteil einer Sekunde zu erhalten

      console.log(`PSC is Deployed! Please click on Save Deployed PSC! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);
      //Set PSC
      setPSCInstance();
      getPSC();
      getPrivileges();
      getProhibitions();
    } else {
      alert("Please install MetaMask and try again.");
    }
    props.setMSG(`PSC is Deployed! Please click on Save Deployed PSC!`);
  };
  //______________________________________________________SAVE PSC_________________________________//
  const saveDeployedPSC = async () => {
    console.clear();
    if (savPSCaddr) {

      //Set TIME when we want start count//
      const startTime = new Date();

      props.setMSG("Saving PSC...");
      try {
        await DATSC.methods
          .addPSC(savPSCaddr)
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
        console.log(`PSC saved! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);
        props.setMSG(`PSC saved!`);
      } catch (error) {
        props.setMSG("Failed to save PSC: " + error.message);
      }
      setPSCInstance();
      getPSC();
      getPrivileges();
      getProhibitions();
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
      getProhibitions();
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

  //PROHIBITIONS__________________________________________________________

  //Create Prohibition Array
  const [prohibitionList, setProhibitionList] = useState([
    {
      attrA_pro_name: "",
      attrA_pro_value: "",
      proRight: "",
      attrB_pro_name: "",
      attrB_pro_value: "",
    },
  ]);

  //Update Prohibition on change
  const handleProhibitionChange = (e, index) => {
    const list = [...prohibitionList];
    list[index][e.target.name] = e.target.value;
    setProhibitionList(list);
  };

  //Remove Prohibition
  const handleRemoveProhibition = (index) => {
    const list = [...prohibitionList];
    list.splice(index, 1);
    setProhibitionList(list);
  };

  //Add more Prohibition inputfields
  const handleAddProhibition = () => {
    setProhibitionList([
      ...prohibitionList,
      {
        attrA_pro_name: "",
        attrA_pro_value: "",
        proRight: "",
        attrB_pro_name: "",
        attrB_pro_value: "",
      },
    ]);
  };

  //Reset All inputfields after PSC creation___________________________________
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
    console.clear();
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

      //If some fields are empty return message to user
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
        crPSC(attributeList, assignmentList, associationList, prohibitionList);
      }
    }
  };

  //Function to create PSC________________________________________________
  const crPSC = async (attributeList, assignmentList, associationList, prohibitionList) => {
    //View all important information (for test purposes)
    //console.log("Step 1. WalletAddress: ", props.walletAddress);
    //console.log("Step 2. Provider: ", props.provider.toString());
    //console.log("Step 3. PSC: ", PSC);
    //Check if the attributeList contains all important informations
    // for (let i = 0; i < attributeList.length; i++) {
    //   console.log(
    //     "Step 4. Attribute ",
    //     i,
    //     "is: ",
    //     attributeList[i].attr,
    //     "Value ",
    //     i,
    //     "is: ",
    //     attributeList[i].val
    //   );
    // }
    //Check if the assignmentList contains all important informations
    // for (let i = 0; i < assignmentList.length; i++) {
    //   console.log(
    //     "Step 5. Assignment --> ",
    //     i,
    //     "AttrA name: ",
    //     assignmentList[i].attrA_name,
    //     "AttrA value: ",
    //     assignmentList[i].attrA_value,
    //     "AttrB name: ",
    //     assignmentList[i].attrB_name,
    //     "AttrB value: ",
    //     assignmentList[i].attrB_value
    //   );
    // }
    //Check if the associationList contains all important informations
    // for (let i = 0; i < associationList.length; i++) {
    //   console.log(
    //     "Step 6. Association --> ",
    //     i,
    //     "AttrA name: ",
    //     associationList[i].attrA_assoc_name,
    //     "AttrA value: ",
    //     associationList[i].attrA_assoc_value,
    //     "AccessRight: ",
    //     associationList[i].accessRight,
    //     "AttrB name: ",
    //     associationList[i].attrB_assoc_name,
    //     "AttrB value: ",
    //     associationList[i].attrB_assoc_value
    //   );
    // }

    //Check if the prohibitionList contains all important informations
    // for (let i = 0; i < prohibitionList.length; i++) {
    //   console.log(
    //     "Step 6.1. Prohibition --> ",
    //     i,
    //     "AttrA name: ",
    //     prohibitionList[i].attrA_pro_name,
    //     "AttrA value: ",
    //     prohibitionList[i].attrA_pro_value,
    //     "AccessRight: ",
    //     prohibitionList[i].proRight,
    //     "AttrB name: ",
    //     prohibitionList[i].attrB_pro_name,
    //     "AttrB value: ",
    //     prohibitionList[i].attrB_pro_value
    //   );
    // }    

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
      // for (let i = 0; i < attributeListAttrNames.length; i++) {
      //   console.log(
      //     "Step 7. attributeListAttrNames: ",
      //     i,
      //     "is: ",
      //     attributeListAttrNames[i]
      //   );
      // }
      //Check attributeListAttrValues Array
      // for (let i = 0; i < attributeListAttrValues.length; i++) {
      //   console.log(
      //     "Step 8. attributeListAttrValues: ",
      //     i,
      //     "is: ",
      //     attributeListAttrValues[i]
      //   );
      // }

      //________________________________________ASSIGNMENT SPLIT_____________________________________________//
      // Convert assignmentList to separate arrays (attrA, attrB)
      // And also seperate AttrA and AttrB to AttrA(name, value) and AttrB(name, value)

      //_______________________ATTR A________________________//
      //________AttrA name________//

      let assignmentListAttrNames_A = assignmentList.map(
        (item) => item.attrA_name
      );

      //Check assignmentListAttrNames_A Array
      // for (let i = 0; i < assignmentListAttrNames_A.length; i++) {
      //   console.log(
      //     "Step 9. assignmentListAttrNames_A: ",
      //     i,
      //     "is: ",
      //     assignmentListAttrNames_A[i]
      //   );
      // }

      //________AttrA value________//
      let assignmentListAttrValues_A = assignmentList.map(
        (item) => item.attrA_value
      );

      //Check assignmentListAttrValues_A Array
      // for (let i = 0; i < assignmentListAttrValues_A.length; i++) {
      //   console.log(
      //     "Step 10. assignmentListAttrValues_A: ",
      //     i,
      //     "is: ",
      //     assignmentListAttrValues_A[i]
      //   );
      // }

      //_______________________ATTR B________________________//
      //________AttrB name________//
      let assignmentListAttrNames_B = assignmentList.map(
        (item) => item.attrB_name
      );

      //Check assignmentListAttrNames_B Array
      // for (let i = 0; i < assignmentListAttrNames_B.length; i++) {
      //   console.log(
      //     "Step 11. assignmentListAttrNames_B: ",
      //     i,
      //     "is: ",
      //     assignmentListAttrNames_B[i]
      //   );
      // }

      //________AttrB value________//
      let assignmentListAttrValues_B = assignmentList.map(
        (item) => item.attrB_value
      );

      //Check assignmentListAttrValues_B Array
      // for (let i = 0; i < assignmentListAttrValues_B.length; i++) {
      //   console.log(
      //     "Step 12. assignmentListAttrValues_B: ",
      //     i,
      //     "is: ",
      //     assignmentListAttrValues_B[i]
      //   );
      // }

      // //________________________________________ASSOCIATION SPLIT_____________________________________________//
      // // Convert associationList to separate arrays (attrA, accessRight, attrB)
      // // And also seperate AttrA and AttrB to AttrA(name, value) and AttrB(name, value)

      // //_______________________ATTR A________________________//
      // //________AttrA name________//
      let associationListAttrNames_A = associationList.map(
        (item) => item.attrA_assoc_name
      );

      //Check associationListAttrNames_A Array
      // for (let i = 0; i < associationListAttrNames_A.length; i++) {
      //   console.log(
      //     "Step 13. associationListAttrNames_A: ",
      //     i,
      //     "is: ",
      //     associationListAttrNames_A[i]
      //   );
      // }

      //________AttrA value________//
      let associationListAttrValues_A = associationList.map(
        (item) => item.attrA_assoc_value
      );

      //Check associationListAttrValues_A Array
      // for (let i = 0; i < associationListAttrValues_A.length; i++) {
      //   console.log(
      //     "Step 14. associationListAttrValues_A: ",
      //     i,
      //     "is: ",
      //     associationListAttrValues_A[i]
      //   );
      // }

      // //_______________________ACCESSRIGHTS________________________//
      let associationAccesRights = associationList.map(
        (item) => item.accessRight
      );

      //Check associationAccesRights Array
      // for (let i = 0; i < associationAccesRights.length; i++) {
      //   console.log(
      //     "Step 15. associationAccesRights: ",
      //     i,
      //     "is: ",
      //     associationAccesRights[i]
      //   );
      // }

      // //_______________________ATTR B________________________//
      // //________AttrB name________//
      let associationListAttrNames_B = associationList.map(
        (item) => item.attrB_assoc_name
      );

      //Check associationListAttrNames_B Array
      // for (let i = 0; i < associationListAttrNames_B.length; i++) {
      //   console.log(
      //     "Step 16. associationListAttrNames_B: ",
      //     i,
      //     "is: ",
      //     associationListAttrNames_B[i]
      //   );
      // }

      //________AttrB value________//
      let associationListAttrValues_B = associationList.map(
        (item) => item.attrB_assoc_value
      );

      //Check associationListAttrValues_B Array
      // for (let i = 0; i < associationListAttrValues_B.length; i++) {
      //   console.log(
      //     "Step 17. associationListAttrValues_B: ",
      //     i,
      //     "is: ",
      //     associationListAttrValues_B[i]
      //   );
      // }


      // //________________________________________PROHIBITION SPLIT_____________________________________________//
      // // Convert prohibitionList to separate arrays (attrA, accessRight, attrB)
      // // And also seperate AttrA and AttrB to AttrA(name, value) and AttrB(name, value)

      // //_______________________ATTR A________________________//
      // //________AttrA name________//
      let prohibitionListAttrNames_A = prohibitionList.map(
        (item) => item.attrA_pro_name
      );

      //Check prohibitionListAttrNames_A Array
      // for (let i = 0; i < prohibitionListAttrNames_A.length; i++) {
      //   console.log(
      //     "Step 13. prohibitionListAttrNames_A: ",
      //     i,
      //     "is: ",
      //     prohibitionListAttrNames_A[i]
      //   );
      // }

      //________AttrA value________//
      let prohibitionListAttrValues_A = prohibitionList.map(
        (item) => item.attrA_pro_value
      );

      //Check prohibitionListAttrValues_A Array
      // for (let i = 0; i < prohibitionListAttrValues_A.length; i++) {
      //   console.log(
      //     "Step 14. prohibitionListAttrValues_A: ",
      //     i,
      //     "is: ",
      //     prohibitionListAttrValues_A[i]
      //   );
      // }

      // //_______________________ACCESSRIGHTS________________________//
      let prohibitionAccesRights = prohibitionList.map(
        (item) => item.proRight
      );

      //Check prohibitionAccesRights Array
      // for (let i = 0; i < prohibitionAccesRights.length; i++) {
      //   console.log(
      //     "Step 15. prohibitionAccesRights: ",
      //     i,
      //     "is: ",
      //     prohibitionAccesRights[i]
      //   );
      // }

      // //_______________________ATTR B________________________//
      // //________AttrB name________//
      let prohibitionListAttrNames_B = prohibitionList.map(
        (item) => item.attrB_pro_name
      );

      //Check prohibitionListAttrNames_B Array
      // for (let i = 0; i < prohibitionListAttrNames_B.length; i++) {
      //   console.log(
      //     "Step 16. prohibitionListAttrNames_B: ",
      //     i,
      //     "is: ",
      //     prohibitionListAttrNames_B[i]
      //   );
      // }

      //________AttrB value________//
      let prohibitionListAttrValues_B = prohibitionList.map(
        (item) => item.attrB_pro_value
      );

      //Check prohibitionListAttrValues_B Array
      // for (let i = 0; i < prohibitionListAttrValues_B.length; i++) {
      //   console.log(
      //     "Step 17. prohibitionListAttrValues_B: ",
      //     i,
      //     "is: ",
      //     prohibitionListAttrValues_B[i]
      //   );
      // }         

      //________________________________________________________________________________
      //Now we export all this created arrays into the PSC
      //________________________________________________________________________________
      props.setMSG("Creating PSC...");

      //Test if there is any error with callok
      let callOK = true;

      //SEND ALL PROHIBITIONS TO THE PSC
      if (!containsEmptyString(prohibitionListAttrNames_A) &&
      !containsEmptyString(prohibitionListAttrValues_A) &&
      !containsEmptyString(prohibitionAccesRights) &&
      !containsEmptyString(prohibitionListAttrNames_B) &&
      !containsEmptyString(prohibitionListAttrValues_B)) {

        try {
          await PSC.methods
            .mergeProhibitions(
              //________Prohibitions__________//
              prohibitionListAttrNames_A,
              prohibitionListAttrValues_A,
              prohibitionAccesRights,
              prohibitionListAttrNames_B,
              prohibitionListAttrValues_B
            )
            .call({ from: props.walletAddress });
        } catch (error) {
          callOK = false;
          seterrerr(error.message);
          console.log(errerr.split("{")[0].trim());
          props.setMSG(errerr.split("{")[0].trim());
        }



        if (callOK) {
          //Set TIME when we want start count//
          const startTime = new Date();

          await PSC.methods
            .mergeProhibitions(
              //________Prohibitions__________//
              prohibitionListAttrNames_A,
              prohibitionListAttrValues_A,
              prohibitionAccesRights,
              prohibitionListAttrNames_B,
              prohibitionListAttrValues_B
            )
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
          console.log(`Prohibitions added! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);
          props.setMSG(`Prohibitions added!`);
        }
      }
      
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
        //Set TIME when we want start count//
        const startTime2 = new Date();

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

        //Set TIME when we want to stop count//
        const endTime2 = new Date();
        //Calc the difference
        const timeInMilliSec2 = endTime2 - startTime2;
        //Convert the time in hours, minutes, seconds, milliseconds
        const timeInSec2 = timeInMilliSec2 / 1000;
        const hours2 = Math.floor(timeInSec2 / 3600);
        const minutes2 = Math.floor((timeInSec2 % 3600) / 60);
        const seconds2 = Math.floor(timeInSec2 % 60);
        const milliseconds2 = (timeInMilliSec2 % 1000) / 1000; 
        console.log(`Policies Created! (Executiontime: ${hours2} Hours, ${minutes2} Minutes, ${seconds2} Seconds, ${milliseconds2} Milliseconds)`);
        getPSC();
        getPrivileges();
        getProhibitions();
        props.setMSG(`Policies Created!`);
      }
    }
  };

  //__________________________ UPDATE PROHIBITIONS _________________________________________________//

  const updateProhibitions = async () => {
    //Check if Wallet is connected
    if (!props.walletAddress) {
      props.setMSG("Connect first to Wallet");
    } else {

      //________AttrA name________//
      let prohibitionListAttrNames_A = prohibitionList.map(
        (item) => item.attrA_pro_name
      );

      //________AttrA value________//
      let prohibitionListAttrValues_A = prohibitionList.map(
        (item) => item.attrA_pro_value
      );

      //___ACCESSRIGHTS___________//
      let prohibitionAccesRights = prohibitionList.map(
        (item) => item.proRight
      );

      //________AttrB name________//
      let prohibitionListAttrNames_B = prohibitionList.map(
        (item) => item.attrB_pro_name
      );

      //________AttrB value________//
      let prohibitionListAttrValues_B = prohibitionList.map(
        (item) => item.attrB_pro_value
      );

      props.setMSG("Updating Prohibitions...");

      //Test if there is any error with callok
      let callOK = true;
      
      //SEND ALL PROHIBITIONS TO THE PSC
      if (!containsEmptyString(prohibitionListAttrNames_A) &&
          !containsEmptyString(prohibitionListAttrValues_A) &&
          !containsEmptyString(prohibitionAccesRights) &&
          !containsEmptyString(prohibitionListAttrNames_B) &&
          !containsEmptyString(prohibitionListAttrValues_B)) {

            try {
              await PSC.methods
                .updateProhibitions(
                  //________Prohibitions__________//
                  prohibitionListAttrNames_A,
                  prohibitionListAttrValues_A,
                  prohibitionAccesRights,
                  prohibitionListAttrNames_B,
                  prohibitionListAttrValues_B
                )
                .call({ from: props.walletAddress });
            } catch (error) {
              callOK = false;
              seterrerr(error.message);
              console.log(errerr.split("{")[0].trim());
              props.setMSG(errerr.split("{")[0].trim());
            }
            if (callOK) {

              //Set TIME when we want start count//
              const startTime = new Date();

              await PSC.methods
                .updateProhibitions(
                  //________Prohibitions__________//
                  prohibitionListAttrNames_A,
                  prohibitionListAttrValues_A,
                  prohibitionAccesRights,
                  prohibitionListAttrNames_B,
                  prohibitionListAttrValues_B
                )
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

              console.log(`Prohibitions up to date! (Executiontime: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds)`);

              getPSC();
              getPrivileges();
              getProhibitions();
              props.setMSG("Prohibitions up to date!");
            }
          } else {
            props.setMSG("Prohibition field empty!");
          }
    }
  }  

  const [errerr, seterrerr] = useState("");

  //________________________________No Array has an empty string _____________________________//
  function containsEmptyString(arr) {
    return arr.some(item => item === "");
  }

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
      //console.log(privileges);
      //console.log("BOX2");
      props.setprivilegess(privileges);
    }
  }, [privileges]);

  const getPrivileges = async () => {
    setPrivileges(
      await PSC.methods.getPrivileges().call({ from: props.walletAddress })
    );
  };

    //_____________________________________GET PROHIBITIONS _____________________________________//

    const [prohibitions, setProhibitions] = useState();

    useEffect(() => {
      if (prohibitions !== undefined) {
        //console.log(prohibitions);
        //console.log("BOX2");
        props.setprohibitionss(prohibitions);
      }
    }, [prohibitions]);
  
    const getProhibitions = async () => {
      setProhibitions(
        await PSC.methods.getProhibitions().call({ from: props.walletAddress })
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
      {/* PROHIBITIONS__________________________________________________________ */}
      <TextOverInput className="Add Prohibition" />
      {prohibitionList.map((x, i) => {
        return (
          <div key={i}>
            <div>
              {/* Inputfields for Prohibition input */}
              <div>
                <input
                  className="text_1of2"
                  type="text"
                  placeholder="Attribute A name"
                  name="attrA_pro_name"
                  value={x.attrA_pro_name}
                  onChange={(e) => handleProhibitionChange(e, i)}
                />
                <input
                  className="text_2of2"
                  type="text"
                  placeholder="Attribute A value"
                  name="attrA_pro_value"
                  value={x.attrA_pro_value}
                  onChange={(e) => handleProhibitionChange(e, i)}
                />
              </div>
              <div>
                {" "}
                <input
                  className="textAccessrights"
                  type="text"
                  placeholder="Accessright"
                  name="proRight"
                  value={x.proRight}
                  onChange={(e) => handleProhibitionChange(e, i)}
                />
              </div>
              <div>
                {" "}
                <input
                  className="text_1of2"
                  type="text"
                  placeholder="Attribute B name"
                  name="attrB_pro_name"
                  value={x.attrB_pro_name}
                  onChange={(e) => handleProhibitionChange(e, i)}
                />{" "}
                <input
                  className="text_2of2"
                  type="text"
                  placeholder="Attribute B value"
                  name="attrB_pro_value"
                  value={x.attrB_pro_value}
                  onChange={(e) => handleProhibitionChange(e, i)}
                />
              </div>
            </div>
            <div>
              {/* If we have more then one Association inputfields add an close button */}
              {prohibitionList.length > 1 && (
                <div>
                  <button
                    className="ButtonX"
                    onClick={() => handleRemoveProhibition(i)}
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
        <button className="generalButton" onClick={handleAddProhibition}>
          Add +1 Prohibition
        </button>
      </div> 
      <div>
        <button className="generalButton" onClick={updateProhibitions}>
          Update Prohibitions
        </button>
      </div>
      <div>_______________________</div>
      <div>
        <button className="generalButton" onClick={createPSC}>
          Create Policies
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
    </div>
  );
}

export default Box2_CreatePolicy;
