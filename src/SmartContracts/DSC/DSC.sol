//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//import Smart Contracts
import "./DATSC.sol";
import "./PSC.sol";
import "./RSC.sol";

//_______________________________TEST REASONS LIBRARY____________________________//
import "@openzeppelin/contracts/utils/Strings.sol";

//Allows us to use the comamnd console.log();
import "hardhat/console.sol";

contract DSC {
    //__________________________________Constructor_________________________________//

    //variable to save the address  of the creator from this contract
    address private owner;

    //Errormessage
    event ErrorMSG(string message);

    //Declaration of instance
    DATSC datscInstance;
    PSC pscInstance;
    RSC rscInstance;

    //__________________________________VARIABLES FOR TESTING_____________________________________________//
    using Strings for string;
    using Strings for uint256;

    string com = "--";

    bool test1;
    address test2;
    address test3;
    string test4;
    string test5;
    bool test6;
    //____________________________________________________________________________________________________//

    //RSC INSTANCE (RESOURCE)
    struct Attribute {
        string name;
        string value;
    }
    //Attribute[] public Attributes;
    struct RSCInstance {
        string uri;
        Attribute[] Attributes;
    }
    RSCInstance[] public allRSCInstances;
    RSCInstance rscInst;

    //Saves the address  of the creator from this contract
    constructor() {
        owner = msg.sender;
        address datscAddress = 0x76435372cCF7f934C9c52ff30ee2A950D631bBad;
        datscInstance = DATSC(datscAddress);
    }

    //____________________________________Modifiers__________________________________//

    //Only the creator of this PSC can call this function
    modifier restricted() {
        require(msg.sender == owner, "You are not the Owner");
        _;
    }

    //_______________________START DESSICION__________________________________//
    function decision(
        string memory uri,
        string memory accessRight,
        string memory userAttributeName,
        string memory userAttributeValue
    ) public returns (bool) {
        //string memory accessResult;
        bool decisionAnswer = false;

        //_____________TEST1_______________// GET decisionAnswer input
        test1 = decisionAnswer;

        //1. Get RSC address from URI input (DATSC getRSCFromURI)
        address rscAddress = datscInstance.getRSCFromURI(uri);

        //_____________TEST2_______________// GET RSC Address
        test2 = address(0);
        test2 = rscAddress;

        //Check RSC address NOT NULL
        require(rscAddress != address(0), "URI NOT Found (Can't Load RSC)");
        //Set RSC address
        rscInstance = RSC(rscAddress);

        //2. Get PSC address from URI input (DATSC getPSCFromURI)
        address pscAddress = datscInstance.getPSCFromURI(uri);

        //_____________TEST3_______________// GET PSC Address
        test3 = address(0);
        test3 = pscAddress;

        //Check PSC address NOT NULL
        require(pscAddress != address(0), "URI NOT Found (Can't Load PSC)");
        //Set PSC address
        pscInstance = PSC(pscAddress);

        //3. Send All Information to get ANSWER!!!
        (
            string[] memory attriRSCname,
            string[] memory attriRSCvalue
        ) = rscInstance.getRSCInstance(uri);

        //_____________TEST4_______________// GET attriRSCname
        test4 ="";
        for (uint256 i = 0; i < attriRSCname.length; i++) {
            test4 = string(abi.encodePacked(test4, com));
            test4 = string(abi.encodePacked(test4, attriRSCname[i]));
        }

        //_____________TEST5_______________// GET attriRSCvalue
        test5 ="";
        for (uint256 i = 0; i < attriRSCvalue.length; i++) {
            test5 = string(abi.encodePacked(test5, com));
            test5 = string(abi.encodePacked(test5, attriRSCvalue[i]));
        }

        require(attriRSCname.length != 0, "No Attributes Found");

        require(
            attriRSCname.length == attriRSCvalue.length,
            "attriRSCname and attriRSCvalue have not the same length"
        );

        decisionAnswer = pscInstance.getAttrBFromAttrAssignments(
            attriRSCname,
            attriRSCvalue,
            accessRight,
            userAttributeName,
            userAttributeValue
        );

        //_____________TEST6_______________// GET last decision anwer
        test6 = false;
        test6 = decisionAnswer;

        return decisionAnswer;
    }

    //________________________________GETTERS FOR TESTREASON_____________________________________________//
    function getTest1() public view returns (bool) {
        return test1;
    }

    function getTest2() public view returns (address) {
        return test2;
    }

    function getTest3() public view returns (address) {
        return test3;
    }

    function getTest4() public view returns (string memory) {
        return test4;
    }

    function getTest5() public view returns (string memory) {
        return test5;
    }

    function getTest6() public view returns (bool) {
        return test6;
    }

}
