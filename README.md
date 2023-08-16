****Next Generation Access Control Based Access Control System with Ethereum Smart Contracts****


**Introduction**
Ensuring authorized data access is crucial for maintaining the confidentiality and integrity of information. The design, analysis, and implementation of reliable systems that authorize specific users to access sensitive data are pivotal for creating secure information systems.



**About the Project**
This project delves into the study and analysis of the Next Generation Access Control (NGAC) access control model. Unlike other models where authorization and access policies are typically expressed using verbal rules, NGAC policies are developed using relations based on assignments, associations, prohibitions, and obligations. NGAC is characterized by its flexibility and can be utilized in a manner that allows or denies access based not only on the attributes of the objects but also on additional conditions such as time, location, etc.

Furthermore, the potential of developing decentralized applications leveraging blockchain technologies, especially those provided by the Ethereum system, is explored.



***DApp Transformation and Adaptation Guide***
Welcome to the DApp Transformation and Adaptation Guide. This guide is specifically designed for developers aiming to modify and adapt the DApp, especially when it comes to the smart contracts: Decision Smart Contract (DSC), Resource Smart Contract (RSC), and Data Smart Contract (DATSC).

Modifying the DApp:
React Code:
Modifying the React code is straightforward and doesn't require additional steps from the developer.

Smart Contracts:
However, when it comes to altering the smart contracts, there are specific steps that need to be followed to ensure proper integration and functionality:

1. Insert Smart Contract Code into Remix: Before starting the deployment, you need to insert the Smart Contract code, which is located in src > SmartContracts, into the Remix development environment. This allows you to deploy and manage the Smart Contracts directly from Remix.
2. Make the changes you want.
3. Deploy a New DATSC on Remix: Start by deploying a new DATSC on the Remix platform.
4. Update DATSC Address: Save the DATSC Address in the RSC, PSC, and DSC code.
5. Deploy New RSC and PSC on Remix: Deploy new RSC and PSC on the Remix platform.
6. Integrate DATSC ABI and Address: Update the React code in the DATSC.js file with the DATSC ABI and address.
7. Update RSC ABI and ByteCode: Save the RSC ABI and ByteCode in the React code within the RSC.js file.
8. Update PSC ABI and ByteCode: Save the PSC ABI and ByteCode in the React code within the PSC.js file.
9. Deploy New DSC on Remix: Deploy new DSC on the Remix platform.
10. Integrate DSC ABI and Address: Update the React code in the DSC.js file with the DSC ABI and address.
These steps are crucial for anyone looking to modify the code in the smart contracts, ensuring that the DApp's smart contracts are correctly modified and integrated for optimal performance.



***DApp User Guide***
1. Enter the command `npm start` to initiate the server and launch the DApp.
2. To utilize the DApp, you need to sign in through MetaMask. Ensure you've installed the MetaMask extension in your browser and select "Connect Wallet" to link with MetaMask.1. Initial User Login
3. First-time DApp users must deploy the PSC and RSC, while returning users will have the Smart Contracts loaded automatically.
4. Development of RSC and PSC
Initially, the user needs to deploy the PSC. Under "Create Policy", the user should click the "Deploy PSC" button.
Once the message "PSC is Deployed! Please click on Save Deployed PSC!" appears, the user should save the PSC to the DATSC smart contract, which acts as a database.
This process should be repeated for the RSC under "Register Resource". The user should click "Deploy RSC" and "Save Deployed RSC" respectively.
5. Policy Determination
To set policies, the user must input attributes, assignments, and associations, considering the following constraints:
Input fields must not be empty.
PSC does not accept identical attributes.
PSC requires at least two attributes.
Attributes added by the user in assignments and associations must already exist.
PSC does not accept identical assignments and associations.
An assignment and an association cannot contain two identical attributes.
To add more than two attributes, and more than one assignment and association, the user should click "Add Attribute", "Add Assignment", and "Add Association" respectively.
After inputting all attributes, assignments, and associations, the user should click "Create PSC" to create the policy and save it. Once saved, the policy cannot be edited. To create a new policy, a new PSC must be deployed.
6. Object Declaration
To register an object, the user should input its URI and its attributes. An object must have at least two attributes.
To complete the object registration, the user should click "Create RSC". Once an object is created, it appears to the user and cannot be edited. However, an object can be deleted by inputting its corresponding number in the table of stored objects and then clicking "Delete RSC".
7. Access Request
To submit an access request for an object owned by another user, the requester should input their own attribute. For instance, to obtain the privilege (User1, r, Object1) and access Object1, the requester should input their own attribute as User:Requester. Along with this, the requester needs to provide the access right and the URI where the object is stored. Clicking "Request Access" prompts the DSC to verify if the requester has the necessary access right.
8. Access Control System Response
The access control process consists of the following steps:
Initially, the DSC reads the URI contained in the user's access request. This URI is used to locate the corresponding PSC from the DATSC database, which defines access policies for this URI.
The DSC then retrieves the privileges associated with this URI from the PSC.
The DSC re-examines these privileges, looking for a privilege that matches the user's attribute, the access right the user is requesting, and the URI where the object the user is requesting access to is stored.
Finally, based on the result of the check, the DSC informs the user via the Front-end whether access to the requested object is allowed "Access succeed" or denied "Access denied".


***Upcoming Features***
Obligations and Prohibitions: This upcoming feature will empower users to define specific actions that are required or forbidden within each policy. By incorporating obligations and prohibitions directly into policies, users will have finer control over access management and greater flexibility in setting permissions.


## License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material
- ShareAlike — if you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- NonCommercial — You may not use the material for commercial purposes.
- ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.


***Contact Information***
Email: stef.gvxds@gmail.com

















































