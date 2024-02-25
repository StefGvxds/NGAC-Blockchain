import Web3 from "../../web3";

const address = "0x6A53d55903B73808EABF272Ad14eEa643169187d";

const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"name": "ErrorMSG",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "pscAddress",
				"type": "string"
			}
		],
		"name": "addPSC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "RSCCreatorAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "pscaddress",
				"type": "address"
			}
		],
		"name": "addPSCTOSENDER",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "rscAddress",
				"type": "string"
			}
		],
		"name": "addRSC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "whoCreatesRSCAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "rscAddress",
				"type": "address"
			}
		],
		"name": "addUriToList",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPSC",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "getPSCFromURI",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRSC",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "getRSCFromURI",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "myPSCAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "removeUriFromList",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
export default new Web3.eth.Contract(abi, address);
