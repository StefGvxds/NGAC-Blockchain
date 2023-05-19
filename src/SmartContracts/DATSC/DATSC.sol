//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//Allows us to use the comamnd console.log();
import "hardhat/console.sol";


contract DATSC {
    //variable to save the address  of the creator from this contract
    address private owner;
    event ErrorMSG(string message);
    string emt;
    address public myPSCAddress;

    //____________________________________Constructor__________________________________//

    constructor() {
        //Saves the address  of the creator from this contract
        owner = msg.sender;
        //Save 
        myPSCAddress = address(this);
    }

    //____________________________________Modifiers__________________________________//
    //Only the creator of this PSC can call this function
    modifier restricted() {
        require(msg.sender == owner, "You are not the Owner");
        _;
    }
    //____________________________________MAPPINGS____________________________________//
    //Saves Creatoraddress and his RSCaddress as string to show in react
    mapping(address => string) userRSC;
    //Saves RSC address
    mapping(address => address) usRSC;

    //Saves Creatoraddress and his PSCaddress  as string to show in react
    mapping(address => string) userPSC;
    //Saves PSC address
    mapping(address => address) usPSC;

    //Saves all URIS and their PSC address
    mapping(string => address) uriList;
    //Saves all URIS and their RSC address
    mapping(string => address) uriShowsRSC;

    //____________________________________Functions__________________________________//

    //add PSC to user
    //Every user can have only one PSC
    //
    function addPSC(string memory pscAddress) public {
        //Return this value to the user
        userPSC[msg.sender] = pscAddress;
        //Saves the PSC address with the creator address
        //address pscaddr = address(bytes20(bytes(pscAddress)));
        //usPSC[msg.sender] = pscaddr;
    }

    //Get PSC
    function getPSC() public returns (string memory) {
        if (bytes(userPSC[msg.sender]).length == 0) {
            emit ErrorMSG("You dont have deployed an PSC please deploy one");
            return emt;
        } else {
            return userPSC[msg.sender];
        }
    }

    //add RSC to user
    //Every user can have only one RSC
    function addRSC(string memory rscAddress) public {
        userRSC[msg.sender] = rscAddress;
        //Saves the RSC address with the creator address
        address rscaddr = address(bytes20(bytes(rscAddress)));
        usRSC[msg.sender] = rscaddr;
    }

    //Get RSC
    function getRSC() public returns (string memory) {
        if (bytes(userRSC[msg.sender]).length == 0) {
            emit ErrorMSG("You dont have deployed an RSC please deploy one");
            return emt;
        } else {
            return userRSC[msg.sender];
        }
    }

    //______________________________ΕDIT URIS_______________________________________//

    //_____________GET PSC FROM URI IN DSC____________//
    // PSC creator mapping to --> PSC address 
    function addPSCTOSENDER(address RSCCreatorAddress, address pscaddress) external {
        usPSC[RSCCreatorAddress] = pscaddress;
    }

    //Call from RSC
    //Add URI (FROM RSC) URI --> PSC address
    function addUriToList(string memory uri, address whoCreatesRSCAddress, address rscAddress) external {
        //Add new URI and show to the PSC from the uri owner
        //because we want to send an access request with the uri in DSC so we need the PSC of the owner of the uri
        address getPSCaddress = usPSC[whoCreatesRSCAddress];
        //uri --> PSC
        uriList[uri] = getPSCaddress;
        //uri --> RSC
        uriShowsRSC[uri] = rscAddress;
    }
    //_______________________________________________________//

    //DELETE URI (FROM RSC)
    function removeUriFromList(string memory uri) external {
        //Delete URI --> PSC
        uriList[uri] = address(0);
        //Delete URI --> RSC
        uriShowsRSC[uri] = address(0);
    }

    //Get PSC from URI (From DCS)
    function getPSCFromURI(string memory uri)
        public
        view
        returns (address)
    {

        //Console
        console.log("7. ",uriList[uri]);

        //Add new URI and show to the PSC from the uri owner
        return uriList[uri];
    }

        //Get RSC from URI (From DCS)
    function getRSCFromURI(string memory uri)
        public
        view
        returns (address)
    {
        //Console
        console.log("5. ",uriShowsRSC[uri]);

        //Add new URI and show to the RSC from the uri owner
        return uriShowsRSC[uri];
    }
}
