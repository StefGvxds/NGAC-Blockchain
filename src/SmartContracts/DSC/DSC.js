import Web3 from "../../web3";

const address = "0x59f4D7F3b7Ac0913F1cE9eB4737da20575c3c030";

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
	},
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
	}
];
export default new Web3.eth.Contract(abi, address);
