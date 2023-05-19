//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//Allows us to use the comamnd console.log();
import "hardhat/console.sol";

import "./DATSC.sol";

contract PSC {
    //DATSC interface declaration
    DATSC public datsc;
    //__________________________________Constructor_________________________________//

    //variable to save the address  of the creator from this contract
    address private owner;

    //Return Error-message
    string errorfeedback;

    //Saves the address  of the creator from this contract
    constructor() {
        owner = msg.sender;
        //Saves the address  of the creator from this contract
        address datscAddress = 0x4CE368922207c786F69D03C281E832e9359387c3;
        datsc = DATSC(datscAddress);
    }

    //____________________________________Modifiers__________________________________//

    //Only the creator of this PSC can call this function
    modifier restricted() {
        require(msg.sender == owner, "You are not the Owner");
        _;
    }

    //___________________________________STRUCTS___________________________________//
    //Attribute struct
    struct Attribute {
        string name;
        string value;
    }

    //Assignment struct
    struct Assignment {
        Attribute attrA;
        Attribute attrB;
    }

    //Association struct
    struct Association {
        Attribute attrA;
        string accessRight;
        Attribute attrB;
    }

    //This PSC contract holds an PSC instance. When we want to change it the currentPSC instace will update
    struct currentPSC {
        Attribute[] attributes;
        Assignment[] assignments;
        Association[] associations;
    }

    //A privilege is the result of the Assignments and Associations that will be passed to DSC
    struct privilege {
        Attribute attrA;
        string accessRight;
        Attribute attrB;
    }

    //Array that contains all priveleges
    privilege[] privileges;

    //PSC INSTANCE
    currentPSC curPSC;

    //Check if an Attribute already exists;
    //**old**mapping(string => bool) checkDoubleAttributes;
    //NEW check if an Attr exist already. **update** check attrname and attrvalue
    mapping(string => bool) checkDoubleAttributes;

    //Checks if an Association already exists
    mapping(string => bool) checkDoubleAssociations;

    //Checks if an Assignment already exists
    mapping(string => bool) checkDoubleAssignments;

    //____________________________________FLAGS___________________________________//

    //It makes sure that the policy Smart Contract will be created in controled steps
    //We have to create first two nodes and then the Assignments and Associations
    uint256 attrFlag = 0;

    //If this flag change to 1 then this Contract is finalized and can not be changed
    uint256 finalizeFlag = 0;

    //___________________________ErrorMessage Function___________________________________________//
    function concatenate(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }

    //____________________________________FUNCTIONS_Attributes___________________________________//

    //________________Function to add a new Attribute (Duplicates are not allowed)
    function addAttribute(string memory attrName, string memory attrValue)
        public
        restricted
    {
        //FLAG, we can change this contract only if finalizeFlag ==0
        if (finalizeFlag != 0) {
            errorfeedback = "This Contract is finalized";
            require(finalizeFlag == 0, errorfeedback);
        }

        //Check if the Attribute exists alrady **update**
        string memory chckAttr = string(abi.encodePacked(attrName, attrValue));
        if (checkDoubleAttributes[chckAttr] == true) {
            errorfeedback = concatenate(
                "This Attribute exists already (AddAttribute): ",
                chckAttr
            );
            require(checkDoubleAttributes[chckAttr] == false, errorfeedback);
        }

        //save attributes in curPSC instance
        curPSC.attributes.push(Attribute(attrName, attrValue));

        //We can create associations and assignments only if we have create two attributes, so increase attrFlag by 1
        attrFlag++;

        // Set the attribute's existence status in the checkDoubleAttributes mapping
        checkDoubleAttributes[chckAttr] = true;
    }

    //____________________________________FUNCTIONS_ASSIGNMENTS___________________________________//

    //Create emty Assignment Struct to fill it with data in addAssignment function
    //Because when we try to create the struct inside the function there will be an Error
    Assignment tmpAssignment;

    //Function to add a new assignment(attrA, attrB) to the assigments Array
    function addAssignment(Attribute memory attrA, Attribute memory attrB)
        public
        restricted
    {
        //FLAG, we can add assignments only if finalizeFlag ==0
        if (finalizeFlag != 0) {
            errorfeedback = "This Contract ist finalized";
            require(finalizeFlag == 0, errorfeedback);
        }

        //FLAG, we can create an Assignment only when nodeFlag >= 2
        if (attrFlag < 2) {
            errorfeedback = "You have to create first two attributes (addAssignment)";
            require(attrFlag >= 2, errorfeedback);
        }

        //Check if attribute A exists
        string memory chckAttrA = string(
            abi.encodePacked(attrA.name, attrA.value)
        );

        //Check if attribute B exists
        string memory chckAttrB = string(
            abi.encodePacked(attrB.name, attrB.value)
        );

        //Check if the user select twice the same node for the same assignment
        if (
            keccak256(abi.encodePacked(attrA.name)) ==
            keccak256(abi.encodePacked(attrB.name)) &&
            keccak256(abi.encodePacked(attrA.value)) ==
            keccak256(abi.encodePacked(attrB.value))
        ) {
            errorfeedback = concatenate(
                "You can't put in a Assignment the same attribute twice (addAssignment): ",
                chckAttrA
            );
            require(
                keccak256(abi.encodePacked(attrA.name)) !=
                    keccak256(abi.encodePacked(attrB.name)) ||
                    keccak256(abi.encodePacked(attrA.value)) !=
                    keccak256(abi.encodePacked(attrB.value)),
                errorfeedback
            );
        }

        if (checkDoubleAttributes[chckAttrA] == false) {
            errorfeedback = concatenate(
                "The first attribute does not exist (addAssignment): ",
                chckAttrA
            );
            require(checkDoubleAttributes[chckAttrA] = true, errorfeedback);
        }

        if (checkDoubleAttributes[chckAttrB] == false) {
            errorfeedback = concatenate(
                "The second attribute does not exist (addAssignment): ",
                chckAttrB
            );
            require(checkDoubleAttributes[chckAttrB] == true, errorfeedback);
        }

        //Put the attributes into the Assignment struct
        tmpAssignment.attrA = attrA;
        tmpAssignment.attrB = attrB;

        //Check if we have already this Assignment
        string memory chckAssgnmnt = string(
            abi.encodePacked(attrA.name, attrA.value, attrB.name, attrB.value)
        );
        if (checkDoubleAssignments[chckAssgnmnt] == true) {
            errorfeedback = concatenate(
                "This Assignment exists already (addAssignment): ",
                chckAssgnmnt
            );
            require(
                checkDoubleAssignments[chckAssgnmnt] == false,
                errorfeedback
            );
        }

        //Put the Assignment into the assignments Array
        curPSC.assignments.push(tmpAssignment);

        //Set map on true (means this association exists)
        checkDoubleAssignments[chckAssgnmnt] = true;
    }

    //____________________________________FUNCTIONS_ASSOCIATIONS___________________________________//

    Association tmpAssociation;

    //Function to add a new Association to Associations Array (use this as input to create a policyClass)
    function addAssociation(
        Attribute memory attrA,
        string memory accessRight,
        Attribute memory attrB
    ) public restricted {
        //FLAG, we can change this contract only if finalizeFlag ==0
        if (finalizeFlag != 0) {
            errorfeedback = "This Assignment exists already";
            require(finalizeFlag == 0, errorfeedback);
        }

        //FLAG, we can create an Association only when nodeFlag >= 2
        if (attrFlag < 2) {
            errorfeedback = "You have to create first two attributes (addAssociation)";
            require(attrFlag >= 2, errorfeedback);
        }

        //Check if both attributes exist
        string memory chckAttrA = string(
            abi.encodePacked(attrA.name, attrA.value)
        );
        string memory chckAttrB = string(
            abi.encodePacked(attrB.name, attrB.value)
        );

        //Check if the user select twice the same attribute for the same association
        if (
            keccak256(abi.encodePacked(attrA.name)) ==
            keccak256(abi.encodePacked(attrB.name)) &&
            keccak256(abi.encodePacked(attrA.value)) ==
            keccak256(abi.encodePacked(attrB.value))
        ) {
            errorfeedback = concatenate(
                "You can't put in a association the same Attribute twice (addAssociation): ",
                chckAttrA
            );
            require(
                keccak256(abi.encodePacked(attrA.name)) !=
                    keccak256(abi.encodePacked(attrB.name)) ||
                    keccak256(abi.encodePacked(attrA.value)) !=
                    keccak256(abi.encodePacked(attrB.value)),
                errorfeedback
            );
        }

        if (checkDoubleAttributes[chckAttrA] == false) {
            errorfeedback = concatenate(
                "The first attribute does not exist (addAssociation): ",
                chckAttrA
            );
            require(checkDoubleAttributes[chckAttrA] == true, errorfeedback);
        }

        if (checkDoubleAttributes[chckAttrB] == false) {
            errorfeedback = concatenate(
                "The second attribute does not exist (addAssociation): ",
                chckAttrB
            );
            require(checkDoubleAttributes[chckAttrB] == true, errorfeedback);
        }

        //Check if we have already this Association
        string memory chckAssoctn = string(
            abi.encodePacked(
                attrA.name,
                attrA.value,
                accessRight,
                attrB.name,
                attrB.value
            )
        );

        if (checkDoubleAssociations[chckAssoctn] == true) {
            errorfeedback = concatenate(
                "This Association exists already (addAssociation): ",
                chckAssoctn
            );
            require(
                checkDoubleAssociations[chckAssoctn] == false,
                errorfeedback
            );
        }

        //Fill tmpAssociation
        tmpAssociation.attrA = attrA;
        tmpAssociation.attrB = attrB;
        tmpAssociation.accessRight = accessRight;

        //Push tmpAssociation to Associations Array
        curPSC.associations.push(tmpAssociation);

        //Set map on true (means this association exists)
        checkDoubleAssociations[chckAssoctn] = true;
    }

    //____________________________________Finalized___________________________________//

    //Function to finalize a contract (after we call this function we can not change the PSC)
    function finalizePSC() public restricted {
        //FLAG, we can close this contract only when nodeFlag >= 2
        if (attrFlag < 2) {
            errorfeedback = "You have to create first two attributes";
            require(attrFlag >= 2, errorfeedback);
        }

        //Set Flag to Closed
        finalizeFlag = 1;
    }

    //Temp attribute for use in executePSC function
    Attribute tmpAttributeA;
    Attribute tmpAttributeB;

    //____________________________________Execute PSC_______________________________//
    //This function executes the above functions and compress them to one
    function executePSC(
        //input to create attribute
        string[] memory attrNames,
        string[] memory attrValues,
        //input to create assignment
        //attrA
        string[] memory assignment_AttrA_name,
        string[] memory assignment_AttrA_value,
        //attrB
        string[] memory assignment_AttrB_name,
        string[] memory assignment_AttrB_value,
        //input to create association
        //attrA
        string[] memory association_AttrA_name,
        string[] memory association_AttrA_value,
        //Accessright
        string[] memory association_AccessRights,
        //attrB
        string[] memory association_AttrB_name,
        string[] memory association_AttrB_value
    ) public restricted {
        //FLAG, we can change this contract only if finalizeFlag ==0
        if (finalizeFlag != 0) {
            errorfeedback = "This Contract ist finalized";
            require(finalizeFlag == 0, errorfeedback);
        }

        //The inputarrays cant be emty
        if (
            attrNames.length == 0 ||
            attrValues.length == 0 ||
            assignment_AttrA_name.length == 0 ||
            assignment_AttrA_value.length == 0 ||
            assignment_AttrB_name.length == 0 ||
            assignment_AttrB_value.length == 0 ||
            association_AttrA_name.length == 0 ||
            association_AttrA_value.length == 0 ||
            association_AccessRights.length == 0 ||
            association_AttrB_name.length == 0 ||
            association_AttrB_value.length == 0
        ) {
            errorfeedback = "Some of the inputfields is emty";
            require(attrNames.length != 0, errorfeedback);
            require(attrValues.length != 0, errorfeedback);
            require(assignment_AttrA_name.length != 0, errorfeedback);
            require(assignment_AttrA_value.length != 0, errorfeedback);
            require(assignment_AttrB_name.length != 0, errorfeedback);
            require(assignment_AttrB_value.length != 0, errorfeedback);
            require(association_AttrA_name.length != 0, errorfeedback);
            require(association_AttrA_value.length != 0, errorfeedback);
            require(association_AccessRights.length != 0, errorfeedback);
            require(association_AttrB_name.length != 0, errorfeedback);
            require(association_AttrB_value.length != 0, errorfeedback);
        }

        //To create an Attribute we need name and value so the both strings have to be equal
        if (attrNames.length != attrValues.length) {
            errorfeedback = "Attribute names and values Array must have the same length (executePSC)";
            require(attrNames.length == attrValues.length, errorfeedback);
        }

        //Compare arrays from Assignment to check that there will be no error in creation
        //attrA name and value check
        if (assignment_AttrA_name.length != assignment_AttrA_value.length) {
            errorfeedback = "AttributeA names and values must have the same length (executePSC - assignment)";
            require(
                assignment_AttrA_name.length == assignment_AttrA_value.length,
                errorfeedback
            );
        }

        //attrB name and value check
        if (assignment_AttrB_name.length != assignment_AttrB_value.length) {
            errorfeedback = "AttributeB names and values must have the same length (executePSC)";
            require(
                assignment_AttrB_name.length == assignment_AttrB_value.length,
                errorfeedback
            );
        }

        //attrA and attrB check
        if (assignment_AttrA_name.length != assignment_AttrB_name.length) {
            errorfeedback = "AttributeA  and AttributeB must have the same length (executePSC)";
            require(
                assignment_AttrA_name.length == assignment_AttrB_name.length,
                errorfeedback
            );
        }

        //Compare arrays from Association to check that there will be no error in creation
        //attrA name and value check
        if (association_AttrA_name.length != association_AttrA_value.length) {
            errorfeedback = "AttributeA names and values must have the same length (executePSC - association)";
            require(
                association_AttrA_name.length == association_AttrA_value.length,
                errorfeedback
            );
        }

        //attrB name and value check
        if (association_AttrB_name.length != association_AttrB_value.length) {
            errorfeedback = "AttributeB names and values must have the same length (executePSC)";
            require(
                association_AttrB_name.length == association_AttrB_value.length,
                errorfeedback
            );
        }

        //attrA and attrB check
        if (association_AttrA_name.length != association_AttrB_name.length) {
            errorfeedback = "AttributeA and AttributeB must have the same length (executePSC)";
            require(
                association_AttrA_name.length == association_AttrB_name.length,
                errorfeedback
            );
        }

        //attrA and accessRigt check
        if (association_AttrA_name.length != association_AccessRights.length) {
            errorfeedback = "AttributeA name and AccessRights must have the same length (executePSC)";
            require(
                association_AttrA_name.length ==
                    association_AccessRights.length,
                errorfeedback
            );
        }

        //create all attributes
        for (uint256 i = 0; i < attrNames.length; i++) {
            string memory attrName = attrNames[i];
            string memory attrValue = attrValues[i];

            addAttribute(attrName, attrValue);
        }

        //create all assignments
        for (uint256 i = 0; i < assignment_AttrA_name.length; i++) {
            //create tmp attribute A
            tmpAttributeA.name = assignment_AttrA_name[i];
            tmpAttributeA.value = assignment_AttrA_value[i];
            //create tmp attribute B
            tmpAttributeB.name = assignment_AttrB_name[i];
            tmpAttributeB.value = assignment_AttrB_value[i];
            //create assignment
            addAssignment(tmpAttributeA, tmpAttributeB);
        }

        //create all associations
        for (uint256 i = 0; i < association_AttrA_name.length; i++) {
            //create tmp attribute A
            tmpAttributeA.name = association_AttrA_name[i];
            tmpAttributeA.value = association_AttrA_value[i];
            //create tmp attribute B
            tmpAttributeB.name = association_AttrB_name[i];
            tmpAttributeB.value = association_AttrB_value[i];
            //create association
            addAssociation(
                tmpAttributeA,
                association_AccessRights[i],
                tmpAttributeB
            );
        }

        //Save PSC to DATSC
        datsc.addPSCTOSENDER(msg.sender, address(this));
        //close PSC
        finalizePSC();
        createPrivileges();
    }

    //____________________________________GETTERS___________________________________//

    function getAllPSC() public view restricted returns (string memory) {
        string memory allPSC;
        string memory separator = "\n--------------------\n";

        //Get all attributes
        allPSC = string(abi.encodePacked(allPSC, "Attributes:", separator));
        for (uint256 i = 0; i < curPSC.attributes.length; i++) {
            string memory attr = string(
                abi.encodePacked(
                    curPSC.attributes[i].name,
                    " - ",
                    curPSC.attributes[i].value,
                    "\n"
                )
            );
            allPSC = string(abi.encodePacked(allPSC, attr));
        }

        //Get all assignments
        allPSC = string(abi.encodePacked(allPSC, "\nAssignments:", separator));
        for (uint256 i = 0; i < curPSC.assignments.length; i++) {
            string memory attrA = string(
                abi.encodePacked(
                    curPSC.assignments[i].attrA.name,
                    " - ",
                    curPSC.assignments[i].attrA.value
                )
            );
            string memory attrB = string(
                abi.encodePacked(
                    curPSC.assignments[i].attrB.name,
                    " - ",
                    curPSC.assignments[i].attrB.value,
                    "\n"
                )
            );
            allPSC = string(abi.encodePacked(allPSC, attrA, " | ", attrB));
        }

        //Get all associations
        allPSC = string(abi.encodePacked(allPSC, "\nAssociations:", separator));
        for (uint256 i = 0; i < curPSC.associations.length; i++) {
            string memory attrA = string(
                abi.encodePacked(
                    curPSC.associations[i].attrA.name,
                    " - ",
                    curPSC.associations[i].attrA.value
                )
            );
            string memory attrB = string(
                abi.encodePacked(
                    curPSC.associations[i].attrB.name,
                    " - ",
                    curPSC.associations[i].attrB.value
                )
            );

            string memory accessRights = string(
                abi.encodePacked(
                    " - Access Rights: ",
                    curPSC.associations[i].accessRight,
                    "\n"
                )
            );

            allPSC = string(
                abi.encodePacked(allPSC, attrA, " | ", attrB, accessRights)
            );
        }

        return allPSC;
    }

    // GET contract is open or closed
    function getClose() public view restricted returns (string memory) {
        string memory mesg;
        if (finalizeFlag == 1) {
            mesg = "Contract is Closed";
            return mesg;
        } else {
            mesg = "Contract is Open";
            return mesg;
        }
    }

    //Get Privileges
    function createPrivileges() public {
        for (uint256 i = 0; i < curPSC.associations.length; i++) {
            Association memory assoc = curPSC.associations[i];

            Attribute[] memory rootsA = findRootAttributes(assoc.attrA);
            Attribute[] memory rootsB = findRootAttributes(assoc.attrB);

            for (uint256 j = 0; j < rootsA.length; j++) {
                for (uint256 k = 0; k < rootsB.length; k++) {
                    if (
                        !isAttributeInAttrB(rootsA[j]) &&
                        !isAttributeInAttrB(rootsB[k])
                    ) {
                        privilege memory newPrivilege;
                        newPrivilege.attrA = rootsA[j];
                        newPrivilege.accessRight = assoc.accessRight;
                        newPrivilege.attrB = rootsB[k];

                        privileges.push(newPrivilege);
                    }
                }
            }
        }
    }

    function isAttributeInAttrB(Attribute memory attr)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < curPSC.assignments.length; i++) {
            if (
                keccak256(abi.encodePacked(curPSC.assignments[i].attrB.name)) ==
                keccak256(abi.encodePacked(attr.name)) &&
                keccak256(
                    abi.encodePacked(curPSC.assignments[i].attrB.value)
                ) ==
                keccak256(abi.encodePacked(attr.value))
            ) {
                return true;
            }
        }
        return false;
    }

    function findRootAttributes(Attribute memory attr)
        internal
        returns (Attribute[] memory)
    {
        bool found = false;
        Attribute[] memory roots;

        for (uint256 i = 0; i < curPSC.assignments.length; i++) {
            if (
                keccak256(abi.encodePacked(curPSC.assignments[i].attrB.name)) ==
                keccak256(abi.encodePacked(attr.name)) &&
                keccak256(
                    abi.encodePacked(curPSC.assignments[i].attrB.value)
                ) ==
                keccak256(abi.encodePacked(attr.value))
            ) {
                found = true;

                // Add the current attribute to the roots array
                Attribute[] memory temp = new Attribute[](1);
                temp[0] = curPSC.assignments[i].attrA;
                roots = mergeArrays(roots, temp);

                // Find root attributes for the current attribute and merge the results
                Attribute[] memory newRoots = findRootAttributes(
                    curPSC.assignments[i].attrA
                );
                roots = mergeArrays(roots, newRoots);
            }
        }

        // If no root attributes were found, return the attribute itself
        if (!found) {
            roots = new Attribute[](1);
            roots[0] = attr;
        }

        return roots;
    }

    function attributeExists(Attribute[] memory array, Attribute memory attr)
        internal
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < array.length; i++) {
            if (
                keccak256(abi.encodePacked(array[i].name)) ==
                keccak256(abi.encodePacked(attr.name)) &&
                keccak256(abi.encodePacked(array[i].value)) ==
                keccak256(abi.encodePacked(attr.value))
            ) {
                return true;
            }
        }
        return false;
    }

    function mergeArrays(Attribute[] memory arrayA, Attribute[] memory arrayB)
        internal
        pure
        returns (Attribute[] memory)
    {
        Attribute[] memory temp = new Attribute[](
            arrayA.length + arrayB.length
        );
        uint256 index = 0;

        for (uint256 i = 0; i < arrayA.length; i++) {
            if (!attributeExists(temp, arrayA[i])) {
                temp[index] = arrayA[i];
                index++;
            }
        }

        for (uint256 i = 0; i < arrayB.length; i++) {
            if (!attributeExists(temp, arrayB[i])) {
                temp[index] = arrayB[i];
                index++;
            }
        }

        Attribute[] memory result = new Attribute[](index);
        for (uint256 i = 0; i < index; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    //__________________________________GET ALL PRIVILEGES AS STRING____________________________________________//
    function getPrivileges() public view returns (string memory) {
        string memory result = "Privileges:\n";

        for (uint256 i = 0; i < privileges.length; i++) {
            string memory privilegeString = string(
                abi.encodePacked(
                    "(",
                    privileges[i].attrA.name,
                    ":",
                    privileges[i].attrA.value,
                    ", ",
                    privileges[i].accessRight,
                    ", ",
                    privileges[i].attrB.name,
                    ":",
                    privileges[i].attrB.value,
                    ")"
                )
            );

            if (i < privileges.length - 1) {
                privilegeString = string(
                    abi.encodePacked(privilegeString, ",\n")
                );
            }
            if (privileges.length == 0) {
                return
                    "No privileges found. Please call createPrivileges() first.";
            }

            result = string(abi.encodePacked(result, privilegeString));
        }

        return result;
    }

    //Call from DSC to get Last attrB from the assignmentchain
    function getAttrBFromAttrAssignments(
        string[] memory attrName,
        string[] memory attrValue,
        string memory accessRight,
        string memory userAttributeName,
        string memory userAttributeValue
    ) public view returns (bool finalAnswer) {
        finalAnswer = false;

        //CONSOLE
        console.log("14. finalAnswer", finalAnswer);

        //Create Array to save all attributes from RSCInstance
        Attribute[] memory attRSCar = new Attribute[](attrName.length);
        //Save all the attributes from RSCInstance
        for (uint256 i = 0; i < attrName.length; i++) {
            Attribute memory tmpAt;
            tmpAt.name = attrName[i];
            tmpAt.value = attrValue[i];
            attRSCar[i] = tmpAt;
        }

        //Compare User Attributes and RSCInstance Attributes and AccessRight Every privilege
        for (uint256 i = 0; i < attRSCar.length; i++) {
            for (uint256 j = 0; j < privileges.length; j++) {
                if (
                    keccak256(abi.encodePacked((attRSCar[i].name))) ==
                    keccak256(abi.encodePacked((privileges[j].attrB.name))) &&
                    keccak256(abi.encodePacked((attRSCar[i].value))) ==
                    keccak256(abi.encodePacked((privileges[j].attrB.value))) &&
                    keccak256(abi.encodePacked((accessRight))) ==
                    keccak256(abi.encodePacked((privileges[j].accessRight))) &&
                    keccak256(abi.encodePacked((userAttributeName))) ==
                    keccak256(abi.encodePacked((privileges[j].attrA.name))) &&
                    keccak256(abi.encodePacked((userAttributeValue))) ==
                    keccak256(abi.encodePacked((privileges[j].attrA.value)))
                ) {
                    finalAnswer = true;
                    return finalAnswer;
                }
            }
        }
    }
}
