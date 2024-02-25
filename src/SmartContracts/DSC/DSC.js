import Web3 from "../../web3";

const address = "0x3788feE2D9F308cD00fC71B4BeD1B43C1371E5c2";

const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "accessRight",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userAttributeName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userAttributeValue",
				"type": "string"
			}
		],
		"name": "decision",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allRSCInstances",
		"outputs": [
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export default new Web3.eth.Contract(abi, address);
