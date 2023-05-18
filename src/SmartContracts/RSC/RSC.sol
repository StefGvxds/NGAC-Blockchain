//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract RSC {
    
    string public uri;  //  Contains the URI where tha data/file are stored
    //mapping(string => string) public attribute; //Creates a Map to store attributes and their values
    struct Attribute {
        string name;
        string value;
    }

    Attribute[] public Attributes;

    //variable to save the address  of the creator from this contract
    address private owner;

    //Flag
    //If this flag turns to 1 this contract can not be changed again
    uint closeRSCFlag = 0;
    // Makes sure that the URI was set
    uint uriFlag = 0;
    //Make sure that at least 2 attributes were set
    uint attrFlag = 0;

    //____________________________________Constructor__________________________________//

    constructor() {
        //Saves the address  of the creator from this contract
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
    function addURI(string memory uriInput) public restricted{
        require(closeRSCFlag == 0, "This Contract ist finalized");
        uri = uriInput;
        uriFlag = 1;
    }

    //  function to add attribute or update a value from an attribute
    function addAttribute(string memory attr, string memory val) public restricted{  
        require(closeRSCFlag == 0, "This Contract ist finalized");
        Attributes.push(Attribute(attr, val));
        //attribute[attr] = val;
        //increase attrFlag + 1
        attrFlag++;  
    }

    //Function to finalize this contract
    function closeRSC() public restricted{
        require(uriFlag == 1, "The URI was not set");
        require(attrFlag >= 2, "You have to set 2 attributes");
        closeRSCFlag = 1;
    }

    //____________________________________Getters__________________________________//
    function getURI() public restricted view returns (string memory) {
        return uri;
    }

    function getAttributes() public restricted view returns (Attribute[] memory){
        return Attributes;
    }

    function getClose() public restricted view returns (string memory) {
        string memory mesg;
        if(closeRSCFlag ==1){
            mesg = "Contract is Closed";
            return mesg;
        } else {
            mesg = "Contract is Open";
            return mesg;
        }
    }

    //Function to destroy the Policy Smart Contract
    // function destroyRSC() public restricted {   
    //     selfdestruct(payable(msg.sender));
    // }

}
