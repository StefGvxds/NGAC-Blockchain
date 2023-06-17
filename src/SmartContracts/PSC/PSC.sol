//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// Import DATSC (Data Smart Contract)
import "./DATSC.sol";

//_______________________________TEST REASONS LIBRARY____________________________//
// Import OpenZeppelin library for string and uint manipulations
import "@openzeppelin/contracts/utils/Strings.sol";

contract PSC {
    //________________________________TEST REASONS_____________________________________________________//
    // Using the OpenZeppelin Strings library for string and uint256 types
    using Strings for string;
    using Strings for uint256;

    // Declare some string constants for output
    string com = "--";
    string eq = "==";

    string test1;
    //________________________________TEST REASONS_____________________________________________________//

    //DATSC instance for imported DATSC
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
        address datscAddress = 0x76435372cCF7f934C9c52ff30ee2A950D631bBad;
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

    //This PSC contract holds an PSC instance. 
    //When we want to change it the currentPSC instace will update
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

    //Check if an Attribute already exists; check attrname and attrvalue
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
    
    // Function to concatenate two strings
    function concatenate(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        // Combines input strings 'a' and 'b' and returns the result
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

        //Check if the Attribute exists alrady
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

    //Function to add a new Association to Associations Array 
    // (use this as input to create a policyClass)
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
        uint256[11] memory arraylength = [
            attrNames.length,
            attrValues.length,
            assignment_AttrA_name.length,
            assignment_AttrA_value.length,
            assignment_AttrB_name.length,
            assignment_AttrB_value.length,
            association_AttrA_name.length,
            association_AttrA_value.length,
            association_AccessRights.length,
            association_AttrB_name.length,
            association_AttrB_value.length
        ];
        errorfeedback = "Some of the inputfields is emty";
        for (uint256 i = 0; i < arraylength.length; i++) {
            checkArrayNotEmpty(arraylength[i], errorfeedback);
        }

        // To create an Attribute we need name and value so the both strings have to be equal
        checkArrayLengths(
            attrNames,
            attrValues,
            "Attribute names and values Array must have the same length (executePSC)"
        );

        // Compare arrays from Assignment to check that there will be no error in creation
        checkArrayLengths(
            assignment_AttrA_name,
            assignment_AttrA_value,
            "AttributeA names and values must have the same length (executePSC - assignment)"
        );
        checkArrayLengths(
            assignment_AttrB_name,
            assignment_AttrB_value,
            "AttributeB names and values must have the same length (executePSC)"
        );
        checkArrayLengths(
            assignment_AttrA_name,
            assignment_AttrB_name,
            "AttributeA and AttributeB must have the same length (executePSC)"
        );

        // Compare arrays from Association to check that there will be no error in creation
        checkArrayLengths(
            association_AttrA_name,
            association_AttrA_value,
            "AttributeA names and values must have the same length (executePSC - association)"
        );
        checkArrayLengths(
            association_AttrB_name,
            association_AttrB_value,
            "AttributeB names and values must have the same length (executePSC)"
        );
        checkArrayLengths(
            association_AttrA_name,
            association_AttrB_name,
            "AttributeA and AttributeB must have the same length (executePSC)"
        );
        checkArrayLengths(
            association_AttrA_name,
            association_AccessRights,
            "AttributeA name and AccessRights must have the same length (executePSC)"
        );

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

        //Save Created Policy and the owneraddress in DATSC 
        datsc.addPSCTOSENDER(msg.sender, address(this));
        //close PSC (No changes allowed)
        finalizePSC();

        // Creates all Priveleges like: 
        //[Root UserAttribute, AccessRight (From Association), Root ObjectAttribute]
        createPrivileges();
    }

    //Compare the length of two Arrays
    function checkArrayLengths(
        string[] memory array1,
        string[] memory array2,
        string memory message
    ) public {
        if (array1.length != array2.length) {
            errorfeedback = message;
            require(array1.length == array2.length, errorfeedback);
        }
    }

    //Check arrays not empty
    function checkArrayNotEmpty(uint256 arraylength, string memory message)
        public
    {
        if (arraylength == 0) {
            errorfeedback = message;
            require(arraylength != 0, errorfeedback);
        }
    }

    //____________________________________GETTERS___________________________________//

    //Return recent Policyclass as string. We need it to keep the owner updated about his policyclass
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
    //(Shows if we can edit the Policy or not)
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

    // Function to create and display privileges for the owner of the contract
    function createPrivileges() public {
        
        // Iterate over all the associations in the current PSC instance
        for (uint256 i = 0; i < curPSC.associations.length; i++) {

            // Create a memory variable for the current association
            Association memory assoc = curPSC.associations[i];

            // Get root attributes for the attributes in the current association
            Attribute[] memory rootsA = findRootAttributes(assoc.attrA);
            Attribute[] memory rootsB = findRootAttributes(assoc.attrB);

            // For each pair of root attributes, if they're not present in attribute B
            // create a new privilege and add it to the privileges array
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

    // This function checks if the given 'attr' attribute exists in the attrB field 
    // of any assignment in the current Policy Smart Contract (PSC).
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

    // Function to find root attributes
    function findRootAttributes(Attribute memory attr)
        internal
        returns (Attribute[] memory)
    {
        bool found = false;
        Attribute[] memory roots;

        // Iterate over all assignments in the current PSC instance
        for (uint256 i = 0; i < curPSC.assignments.length; i++) {
           // If the attribute in the assignment matches the input attribute, proceed
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

                // Recursively find root attributes for the attribute A in the current assignment
                // and merge the results into the roots array
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

    // Function to check if a specific attribute already exists in an attribute array
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
                // If no match is found, return false
                return true;
            }
        }
        return false;
    }

    // Function to merge two arrays of attributes
    function mergeArrays(Attribute[] memory arrayA, Attribute[] memory arrayB)
        internal
        pure
        returns (Attribute[] memory)
    {
        
        // Create a temporary array with size equal to sum of input arrays
        Attribute[] memory temp = new Attribute[](
            arrayA.length + arrayB.length
        );
        uint256 index = 0;

        // Add unique attributes from arrayA to the temporary array
        for (uint256 i = 0; i < arrayA.length; i++) {
            if (!attributeExists(temp, arrayA[i])) {
                temp[index] = arrayA[i];
                index++;
            }
        }

        // Add unique attributes from arrayB to the temporary array
        for (uint256 i = 0; i < arrayB.length; i++) {
            if (!attributeExists(temp, arrayB[i])) {
                temp[index] = arrayB[i];
                index++;
            }
        }

        // Create a result array with the size equal to the number of unique attributes
        // and populate it with the attributes from the temporary array
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
    ) public returns (bool finalAnswer) {

        finalAnswer = false;
        require(
            attrName.length == attrValue.length,
            "Attributes and Values have not the same length"
        );

        test1 = "";
        for (uint256 i = 0; i < attrName.length; i++) {
            for (uint256 j = 0; j < privileges.length; j++) {
                if (
                    keccak256(abi.encodePacked((attrName[i]))) ==
                    keccak256(abi.encodePacked((privileges[j].attrB.name))) &&
                    keccak256(abi.encodePacked((attrValue[i]))) ==
                    keccak256(abi.encodePacked((privileges[j].attrB.value))) &&
                    keccak256(abi.encodePacked((accessRight))) ==
                    keccak256(abi.encodePacked((privileges[j].accessRight))) &&
                    keccak256(abi.encodePacked((userAttributeName))) ==
                    keccak256(abi.encodePacked((privileges[j].attrA.name))) &&
                    keccak256(abi.encodePacked((userAttributeValue))) ==
                    keccak256(abi.encodePacked((privileges[j].attrA.value)))
                ) {
                    test1 = string(abi.encodePacked(test1, attrName[i]));
                    test1 = string(abi.encodePacked(test1, eq));
                    test1 = string(abi.encodePacked(test1, privileges[j].attrB.name));

                    test1 = string(abi.encodePacked(test1, attrValue[i]));
                    test1 = string(abi.encodePacked(test1, eq));
                    test1 = string(abi.encodePacked(test1, privileges[j].attrB.value));

                    test1 = string(abi.encodePacked(test1, accessRight));
                    test1 = string(abi.encodePacked(test1, eq));
                    test1 = string(abi.encodePacked(test1, privileges[j].accessRight));

                    test1 = string(abi.encodePacked(test1, userAttributeName));
                    test1 = string(abi.encodePacked(test1, eq));
                    test1 = string(abi.encodePacked(test1, privileges[j].attrA.name));

                    test1 = string(abi.encodePacked(test1, userAttributeValue));
                    test1 = string(abi.encodePacked(test1, eq));
                    test1 = string(abi.encodePacked(test1, privileges[j].attrA.value));

                    finalAnswer = true;
                    break;  
                }
            }
        }
        return finalAnswer;
    }

    //________________________________TEST REASONS_____________________________________________________//

    function getTest1() public view returns (string memory) {
        return test1;
    }
}
