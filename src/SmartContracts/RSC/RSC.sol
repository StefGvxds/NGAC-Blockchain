//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./DATSC.sol";

//_______________________________TEST REASONS LIBRARY____________________________//
import "@openzeppelin/contracts/utils/Strings.sol";

contract RSC {
    //________________________________TEST REASONS_____________________________________________________//
    using Strings for string;
    using Strings for uint256;

    string com = "--";

    bool test1;
    uint256 test2;
    string test3;
    string test4;
    bool test5;
    uint256 test6;
    string test7;
    string test8;
    //________________________________TEST REASONS_____________________________________________________//

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
        address datscAddress = 0x76435372cCF7f934C9c52ff30ee2A950D631bBad;
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

    //GET RSC Instances array
    // function getAllRSCInsta() public view returns (RSCInstance[] memory) {
    //     return allRSCInstances;
    // }

    //CALL FROM DSC
    //Get Attributes as string array
    function getRSCInstance(string memory uri)
        public
        returns (string[] memory, string[] memory)
    {
        bool rscExists = false;

        //____________TEST 1 ___________// get rscExists
        test1 = rscExists;

        uint256 getRSC;

        //____________TEST 2 ___________// get getRSC
        test2 = 0;
        test2 = getRSC;

        //____________TEST 3 ___________// get URI input
        test3 = uri;

        // Check if there's an RSC with the input URI
        test4 = "";
        for (uint256 i = 0; i < allRSCInstances.length; i++) {
            //____________TEST 4 ___________// get URIS from ALL RSCs
            test4 = string(abi.encodePacked(test4, com));
            test4 = string(abi.encodePacked(test4, allRSCInstances[i].uri));
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

        //____________TEST 5 ___________// get rscExists
        test5 = rscExists;

        //____________TEST 6 ___________// get getRSC
        test6 = getRSC;

        require(rscExists, "There is no URI found in RSC");

        // Initialize the arrays with the correct length
        uint256 attrsLength = allRSCInstances[getRSC].Attributes.length;
        string[] memory tempAttriRSCname = new string[](attrsLength);
        string[] memory tempAttriRSCvalue = new string[](attrsLength);

        //Get all Attributes from an RSC Instance
        test7 = "";
        test8 = "";
        for (uint256 i = 0; i < attrsLength; i++) {
            // Add the new element to the two arrays
            tempAttriRSCname[i] = allRSCInstances[getRSC].Attributes[i].name;
            tempAttriRSCvalue[i] = allRSCInstances[getRSC].Attributes[i].value;
            //____________TEST 7 ___________// get tempAttriRSCname
            test7 = string(abi.encodePacked(test7, com));
            test7 = string(
                abi.encodePacked(
                    test7,
                    allRSCInstances[getRSC].Attributes[i].name
                )
            );
            //____________TEST 8 ___________// get tempAttriRSCvalue
            test8 = string(abi.encodePacked(test8, com));
            test8 = string(
                abi.encodePacked(
                    test8,
                    allRSCInstances[getRSC].Attributes[i].value
                )
            );
        }
        return (tempAttriRSCname, tempAttriRSCvalue);
    }

    //________________________________TEST REASONS_____________________________________________________//

    function getTest1() public view returns (bool) {
        return test1;
    }

    function getTest2() public view returns (uint256) {
        return test2;
    }

    function getTest3() public view returns (string memory) {
        return test3;
    }

    function getTest4() public view returns (string memory) {
        return test4;
    }

    function getTest5() public view returns (bool) {
        return test5;
    }

    function getTest6() public view returns (uint256) {
        return test6;
    }

    function getTest7() public view returns (string memory) {
        return test7;
    }

    function getTest8() public view returns (string memory) {
        return test8;
    }
}
