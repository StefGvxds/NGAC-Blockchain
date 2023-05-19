//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//import Smart Contracts
import "./DATSC.sol";
import "./PSC.sol";
import "./RSC.sol";

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
        address datscAddress = 0x4CE368922207c786F69D03C281E832e9359387c3;
        datscInstance = DATSC(datscAddress);
    }

    //____________________________________Modifiers__________________________________//

    //Only the creator of this PSC can call this function
    modifier restricted() {
        require(msg.sender == owner, "You are not the Owner");
        _;
    }

    //____________________________________Functions__________________________________//

    //Converts String to address
    // function parseAddr(string memory _a)
    //     public
    //     pure
    //     returns (address _parsedAddress)
    // {
    //     bytes memory tmp = bytes(_a);
    //     uint160 iaddr = 0;
    //     uint160 b1;
    //     uint160 b2;
    //     for (uint256 i = 2; i < 2 + 2 * 20; i += 2) {
    //         iaddr *= 256;
    //         b1 = uint160(uint8(tmp[i]));
    //         b2 = uint160(uint8(tmp[i + 1]));
    //         if ((b1 >= 97) && (b1 <= 102)) {
    //             b1 -= 87;
    //         } else if ((b1 >= 65) && (b1 <= 70)) {
    //             b1 -= 55;
    //         } else if ((b1 >= 48) && (b1 <= 57)) {
    //             b1 -= 48;
    //         }
    //         if ((b2 >= 97) && (b2 <= 102)) {
    //             b2 -= 87;
    //         } else if ((b2 >= 65) && (b2 <= 70)) {
    //             b2 -= 55;
    //         } else if ((b2 >= 48) && (b2 <= 57)) {
    //             b2 -= 48;
    //         }
    //         iaddr += (b1 * 16 + b2);
    //     }
    //     return address(iaddr);
    // }

    // //SAVE PSC ADDRESS
    // function getPSC() public {
    //     string memory result = datscInstance.getPSC();
    //     if (bytes(result).length == 0) {
    //         emit ErrorMSG("There is no PSC");
    //     } else {
    //         // address pscAddress = address(
    //         //     uint160(uint256(keccak256(abi.encodePacked(result))))
    //         // );
    //         address pscAddress = parseAddr(result);
    //         pscInstance = PSC(pscAddress);
    //         emit ErrorMSG(result);
    //     }
    // }

    // //SAVE RSC ADDRESS
    // function getRSC() public returns (string memory) {
    //     string memory result = datscInstance.getRSC();
    //     if (bytes(result).length == 0) {
    //         emit ErrorMSG("There is no PSC");
    //         return result = "emty";
    //     } else {
    //         // address rscAddress = address(
    //         //     uint160(uint256(keccak256(abi.encodePacked(result))))
    //         // );

    //         address rscAddress = parseAddr(result);
    //         rscInstance = RSC(rscAddress);
    //         emit ErrorMSG(result);
    //         return result;
    //     }
    // }

    //____________________________________Getters__________________________________//

    // function showPSCAddr() public view returns (PSC) {
    //     return pscInstance;
    // }

    // function showRSCAddr() public view returns (address) {
    //     return address(rscInstance);
    // }

    //_______________________START DESSICION__________________________________//
    function decision(
        string memory uri,
        string memory accessRight,
        string memory userAttributeName,
        string memory userAttributeValue
    ) public returns (bool) {
        //string memory accessResult;
        bool decisionAnswer = false;

        //1. Get RSC address from URI input (DATSC getRSCFromURI)
        address rscAddress = datscInstance.getRSCFromURI(uri);

        //Check RSC address NOT NULL
        require(rscAddress != address(0), "URI NOT Found (Can't Load RSC)");
        //Set RSC address
        rscInstance = RSC(rscAddress);

        //2. Get PSC address from URI input (DATSC getPSCFromURI)
        address pscAddress = datscInstance.getPSCFromURI(uri);

        //Check PSC address NOT NULL
        require(pscAddress != address(0), "URI NOT Found (Can't Load PSC)");
        //Set PSC address
        pscInstance = PSC(pscAddress);

        //3. Send All Information to get ANSWER!!!
        (string[] memory attriRSCname, string[] memory attriRSCvalue) = rscInstance.getRSCInstance(uri);

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

        return (decisionAnswer);
    }

    //ALL DECISION FUNCTION FOR TEST REASONS AS GETTER!!!
    function desGetRSCADDRESS(string memory uri) public view returns (address) {
        address rscAddress = datscInstance.getRSCFromURI(uri);
        return rscAddress;
    }

    function desGetPSCADDRESS(string memory uri) public view returns (address) {
        address pscAddress = datscInstance.getPSCFromURI(uri);
        return pscAddress;
    }

    function desGetAllAttributes(string memory uri)
        public
        returns (string[] memory, string[] memory)
    {
        address rsc = desGetRSCADDRESS(uri);
        //address psc = desGetPSCADDRESS(uri);
        rscInstance = RSC(rsc);
        //pscInstance = PSC(psc);
        (
            string[] memory attriRSCname,
            string[] memory attriRSCvalue
        ) = rscInstance.getRSCInstance(uri);
        return (attriRSCname, attriRSCvalue);
    }
}
