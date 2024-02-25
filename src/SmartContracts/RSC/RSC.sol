//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./DATSC.sol";

//_______________________________TEST REASONS LIBRARY____________________________//
import "@openzeppelin/contracts/utils/Strings.sol";

contract RSC {
    using Strings for string;
    using Strings for uint256;

    //DATSC declaration
    DATSC public datsc;

    struct Attribute {
        string name;
        string value;
    }

    //Attribute[] public Attributes;
    struct RSCInstance {
        string uri;
        Attribute[] Attributes;
    }

    RSCInstance rscInst;

    RSCInstance[] allRSCInstances;

    //variable to save the address  of the creator from this contract
    address private owner;

    //Flag
    //If this flag turns to 1 this contract can not be changed again
    // uint closeRSCFlag = 0;
    // Makes sure that the URI was set
    uint256 uriFlag = 0;
    //Make sure that at least 2 attributes were set
    uint256 attrFlag = 0;

    //____________________________________Constructor__________________________________//

    constructor() {
        //Saves the address  of the creator from this contract
        address datscAddress = 0x2ef5Db5f47A9e25E6F33202fc023826552E93246;
        datsc = DATSC(datscAddress);
        owner = msg.sender;
    }

    //____________________________________Modifiers__________________________________//

    //Only the creator of this PSC can call this function
    modifier restricted() {
        require(msg.sender == owner, "You are not the Owner");
        _;
    }

    //____________________________________Functions__________________________________//

    //Function to add URI
    function addURI(string memory uriInput) public {
        rscInst.uri = uriInput;
        //Add URI To Urimapping in DATSC
        datsc.addUriToList(uriInput, msg.sender, address(this));
        uriFlag = 1;
    }

    //  function to add attribute or update a value from an attribute
    function addAttribute(string memory attr, string memory val)
        public
        restricted
    {
        // require(closeRSCFlag == 0, "This Contract ist finalized");
        rscInst.Attributes.push(Attribute(attr, val));
        //increase attrFlag + 1
        attrFlag++;
    }

    //Function to execute the above 3 functions
    function executeRSC(
        string memory uriInput,
        string[] memory attrNames,
        string[] memory attrValues
    ) public restricted {
        //require(closeRSCFlag == 0, "This Contract is finalized");

        //reset instance
        delete rscInst.uri;
        delete rscInst.Attributes;

        require(attrNames.length >= 2, "You have to set at least 2 attributes");
        require(
            attrNames.length == attrValues.length,
            "Attribute names and values must have the same length"
        );
        //reset flags
        uriFlag = 0;
        attrFlag = 0;

        addURI(uriInput);

        for (uint256 i = 0; i < attrNames.length; i++) {
            addAttribute(attrNames[i], attrValues[i]);
        }

        allRSCInstances.push(rscInst);
        getRSCInstances();
        //closeRSC();
    }

    function deleteRSCInstance(uint256 index) public restricted {
        require(index < allRSCInstances.length, "Index out of bounds");

        //Get URI from RSC Instance because we need the string to delete it from DATSC List
        string memory curURI = allRSCInstances[index].uri;

        for (uint256 i = index; i < allRSCInstances.length - 1; i++) {
            allRSCInstances[i] = allRSCInstances[i + 1];
        }

        //remove URI from Urimapping in DATSC
        datsc.removeUriFromList(curURI);

        allRSCInstances.pop();
        getRSCInstances();
    }

    //____________________________________Getters__________________________________//

    function getRSCInstances()
        public
        view
        restricted
        returns (string[] memory)
    {
        //To have access the contract needs to be closed for security reasons
        //require(closeRSCFlag == 1, "This Contract is not finalized");
        string[] memory combinedResults = new string[](allRSCInstances.length);
        for (uint256 i = 0; i < allRSCInstances.length; i++) {
            combinedResults[i] = allRSCInstances[i].uri;

            uint256 numAttrs = allRSCInstances[i].Attributes.length;
            for (uint256 j = 0; j < numAttrs; j++) {
                combinedResults[i] = string(
                    abi.encodePacked(
                        combinedResults[i],
                        "; ",
                        allRSCInstances[i].Attributes[j].name,
                        ": ",
                        allRSCInstances[i].Attributes[j].value
                    )
                );
            }
        }
        return combinedResults;
    }

    //CALL FROM DSC
    //Get Attributes as string array
    function getRSCInstance(string memory uri)
        public view
        returns (string[] memory, string[] memory)
    {
        bool rscExists = false;
        uint256 getRSC;

        // Check if there's an RSC with the input URI
        for (uint256 i = 0; i < allRSCInstances.length; i++) {
            if (
                keccak256(abi.encodePacked(uri)) ==
                keccak256(abi.encodePacked(allRSCInstances[i].uri))
            ) {
                rscExists = true;
                getRSC = i;
                // Stop the loop as we found the uri
                break;
            }
        }

        require(rscExists, "There is no URI found in RSC");

        // Initialize the arrays with the correct length
        uint256 attrsLength = allRSCInstances[getRSC].Attributes.length;
        string[] memory tempAttriRSCname = new string[](attrsLength);
        string[] memory tempAttriRSCvalue = new string[](attrsLength);

        //Get all Attributes from an RSC Instance

        for (uint256 i = 0; i < attrsLength; i++) {
            // Add the new element to the two arrays
            tempAttriRSCname[i] = allRSCInstances[getRSC].Attributes[i].name;
            tempAttriRSCvalue[i] = allRSCInstances[getRSC].Attributes[i].value;
        }
        return (tempAttriRSCname, tempAttriRSCvalue);
    }
}
