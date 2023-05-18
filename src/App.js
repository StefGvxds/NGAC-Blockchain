import "./App.css";
import React, { useState, useEffect } from "react";
import DappTitle from "./components/Parts/Title/DappTitle.js";
import DappMessage from "./components/Parts/Message/DappMessage.js";
import BoxContainer_1 from "./components/BoxContainer-1/BoxContainer_1.js";
import BoxContainer_2 from "./components/BoxContainer-2/BoxContainer_2.js";
import Web3 from "./web3";
import RSC from "./SmartContracts/RSC/RSC";
import { GlobalProvider } from "./GlobalContext";

function App() {
  //update REACT
  const [updateCounter, setUpdateCounter] = useState(0);
  const handleUpdate = () => {
    setUpdateCounter((prev) => prev + 1);
  };

  //_________________________________________Handle Message__________________________
  const [errmsg, setMsg] = useState("");

  const chngMSG = (messageInput) => {
    setMsg(messageInput);
  };

  //_________________________________________Handle show all RSC Instances_____________
  const [rscInstances, setRscInstances] = useState([]);
  const chngRSCInstance = async (rscInstance) => {
    setRscInstances(rscInstance);
  };

  useEffect(() => {
    for (let i = 0; i < rscInstances.length; i++) {
      console.log("RSCINST: ", rscInstances[i]);
    }
  }, [rscInstances]);

  //_________________________________________SET PSC Instance_____________

  const [pscInstance, setpscInstance] = useState([]);
  const getPSCInstance = async (pscInstance) => {
    setpscInstance(pscInstance);
    console.log(pscInstance);
  };

  useEffect(() => {
    console.log(pscInstance);
  }, [pscInstance]);

  //_________________________________________SET PRIVILEGES_________________?

  const [privilegess, setprivilegess] = useState([]);
  // const getprivilegess = async (privilegess) => {
  //   setprivilegess(pscInstance);
  //   console.log("APP");
  //   console.log(privilegess);
  // };

  // useEffect(() => {
  //   console.log(pscInstance);
  // }, [pscInstance]);

  //___________________________________GET PSC, RSC ADDRESS______________________________________//
  const [RSCaddr, setRSCaddr] = useState("");
  const [PSCaddr, setPSCaddr] = useState("");





  //_________________________________________Connect to MetaMask__________________________
  const [provider, setProvider] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState("");

  //https://www.geeksforgeeks.org/how-to-connect-reactjs-with-metamask/
  const connectMetaMask = async () => {
    //check if metamask is installed
    //const prov = window.ethereum;
    if (window.ethereum) {
      setProvider(Web3.currentProvider); //or (window.ethereum)
    } else {
      setMsg("install metamask extension!!");
    }
    try {
      // Request connection to user's MetaMask wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // Set connectedAddress state to first account in array
      setWalletAddress(accounts[0]);
      setMsg("Connected!");
    } catch (error) {
      setMsg("Can not connect to MetaMask");
    }
    //update REACT
    if (window.ethereum) {
      handleUpdate();
    }
  };

  //Listen to changes if the Provider or the walletAddress are changed
  useEffect(() => {
    if (window.ethereum) {
      // Listen for provider changes
      window.ethereum.on("chainChanged", () => {
        //setWeb3(new Web3(window.ethereum));
        setProvider(web3.currentProvider);
      });

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    }
  }, []);

  //___________________TAKE RSC DATA AND --> BoxContainer2__________________________
  // const [rscADDR, setrscADDR] = useState("");
  // const [rscURI, setrscURI] = useState("");
  // const [rscATTR, setrscATTR] = useState("");

  // const addRSCToBoxContainer2 = (
  //   contractAddress,
  //   contractURI,
  //   contractAttr
  //   //contractClosed
  // ) => {
  //   setrscADDR(contractAddress);
  //   setrscURI(contractURI);
  //   setrscATTR(contractAttr);
  //   //setrscCLOSED(contractClosed);
  // };

  //_________________________________________________________RETURN__________________________
  return (
    <GlobalProvider>
      <div>
        <DappTitle />
        <div id="toptop">
          <button id="metaMaskButton" onClick={connectMetaMask}>
            Connect Wallet
          </button>
          <DappMessage setMSG={errmsg} />
        </div>
        <div id="wallet">
          <div>
            <h3>WalletAddress: {walletAddress}</h3>
          </div>
        </div>
        <BoxContainer_1
          getMSG={chngMSG}
          provider={provider}
          walletAddress={walletAddress}
          //addRSCToBoxContainer2={addRSCToBoxContainer2}
          //RSC
          chngRSCInstance={chngRSCInstance}
          setRSCaddr={setRSCaddr}
          //PSC
          getPSCInstance={getPSCInstance}
          //Privileges
          //getprivilegess={getprivilegess}
          setprivilegess={setprivilegess}
          setPSCaddr={setPSCaddr}
          //Update REACT
          updateCounter={updateCounter}

        />
        <BoxContainer_2
          //rscADDR={rscADDR}
          //rscURI={rscURI}
          //rscATTR={rscATTR}
          //RSC
          rscInstances={rscInstances}
          RSCaddr={RSCaddr}
          //PSC
          pscInstance={pscInstance}
          PSCaddr={PSCaddr}
          //Privileges
          privilegess={privilegess}

          //Update REACT
          updateCounter={updateCounter}
        />
      </div>
    </GlobalProvider>
  );
}

export default App;
