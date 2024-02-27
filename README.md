Next Generation Access Control Based Access Control System with Ethereum Smart Contracts
-------

**Introduction**
Ensuring authorized data access is crucial for maintaining the confidentiality and integrity of information. The design, analysis, and implementation of reliable systems that authorize specific users to access sensitive data are pivotal for creating secure information systems.



About the Project
-------
This project delves into the study and analysis of the Next Generation Access Control (NGAC) access control model. Unlike other models where authorization and access policies are typically expressed using verbal rules, NGAC policies are developed using relations based on assignments, associations and prohibitions. NGAC is characterized by its flexibility and can be utilized in a manner that allows or denies access based not only on the attributes of the objects but also on additional conditions such as time, location, etc.

Furthermore, the potential of developing decentralized applications leveraging blockchain technologies, especially those provided by the Ethereum system, is explored.



DApp Transformation and Adaptation Guide
-------
Welcome to the DApp Transformation and Adaptation Guide. This guide is specifically designed for developers aiming to modify and adapt the DApp, especially when it comes to the smart contracts: Decision Smart Contract (DSC), Resource Smart Contract (RSC), and Data Smart Contract (DATSC).

***Modifying the DApp:***  
***React Code:***  
Modifying the React code is straightforward and doesn't require additional steps from the developer.

***Smart Contracts:***  
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



DApp User Guide
-------
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

Operation
-------
In NGAC, a policy is depicted with assignment and association relationships as a graph. Users and user attributes are located on the left side of the graph, while objects and object attributes are on the right side. Arrows represent assignment relationships, while dashed lines indicate associations. Collectively, associations and assignments indirectly determine the privileges of the form (user, access right, resource), meaning that the user 'user' has permission (or possesses a capability) to execute the access right 'access right' on the object 'object'. Verifying the existence of a privilege (a derived relationship) is a requirement for access decision computation. Access rights are indirectly determined through these relationships, resulting in the user having permission or the capability to execute access rights on specific objects.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/8b51bf50-0143-4556-9d0f-329f804d722c" width="450" height="300" />


Input Data for DApp
-------
The DApp includes an algorithm for detecting privileges based on user-defined policies. Below are the attributes, privileges, assignments, and associations resulting from the above image.

Attributes:
- User: User1
- User: User2
- Group: Group1
- Group: Group2
- Object: Object1
- Object: Object2
- Object: Object3
- Project: Project1
- Project: Project2
- Project: Projects
- Content: Secret
- OrganisationUnit: Division

Users User1 and User2 have the following privileges:
- User1 can read Object1, write to Object2, read Object2, read Object3, and write to Object3.
- User2 can write to Object1, read Object1, and read Object2.

Privileges:
- (User1, r, Object1)
- (User1, w, Object2)
- (User1, r, Object2)
- (User1, r, Object3)
- (User1, w, Object3)
- (User2, w, Object1)
- (User2, r, Object1)
- (User2, r, Object2)

Assignments of users and groups are as follows:
- User1 belongs to Group1, and User2 belongs to Group2.
- Group1 and Group2 belong to the Division category.
- Object1 belongs to Project1, which in turn belongs to Projects.
- Object2 belongs to Project2, which in turn belongs to Projects.
- Object3 belongs to the Secret category.

Assignments:
- (User1, Group1)
- (User2, Group2)
- (Group1, Division)
- (Group2, Division)
- (Object1, Project1)
- (Project1, Projects)
- (Object2, Project2)
- (Project2, Projects)
- (Object3, Secret)

Associations between groups and objects are as follows:
- Group1 has write (w) permissions on Project2, read (r), and write (w) permissions on Secret.
- Group2 has write (w) permissions on Project1.
- The Division category has read (r) permissions on Projects.

Associations:
- (Group1, w, Project2)
- (Group1, r, Secret)
- (Group1, w, Secret)
- (Group2, w, Project1)
- (Division, r, Projects)

User Login
-------
Upon entering the DApp, it is essential for the user to connect their electronic wallet by clicking the "Connect Wallet" button. To establish this connection, the prerequisite is the installation of the MetaMask extension in the web browser. When the user connects to the DApp via their electronic wallet, the wallet address is displayed on the screen. If the user is making their first entry into the DApp, they will need to deploy PSC and RSC. However, if the user has already deployed PSC and RSC, the Smart Contracts load automatically.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/1a089a13-7f42-44fc-9957-a6108539f98f" width="500" height="80" />

Development of RSC and PSC
-------
Initially, the user needs to deploy the PSC. In the "Create Policy" section, the user should click the "Deploy PSC" button. Once the message "PSC is Deployed! Please click on Save Deployed PSC!" appears, the user is prompted to save the PSC in the DATSC smart contract, which serves as a database, by clicking the "Save Deployed PSC" button.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/d6c104ce-66e0-432b-b33f-476d5e5a94a3" width="400" height="300" />

This process must be repeated for RSC, with the difference being that the development of RSC is carried out in the "Register Resource" section. In this case, the user should click the "Deploy RSC" and "Save Deployed RSC" buttons, respectively.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/81a0486e-cfca-4ebb-af61-6a41f87a57f4" width="600" height="350" />

Policy Definition
-------
To define policies, the user needs to input attributes, assignments, and associations, taking into account the following constraints:

- Input fields should not be left blank.
- PSC does not accept identical attributes (e.g., User:user1 and User:user1 are not allowed).
- PSC requires at least two attributes.
- The attributes added by the user in assignments and associations should already exist in the respective fields.
- PSC does not accept identical assignments and associations.
- An assignment and association should not contain two identical attributes.

In this case, the user needs to input the data described above in "Input Data for DApp". Specifically, the user must:

- Input names and attribute values in the respective fields.
- Choose from the existing attributes those that will be used to create assignments.
- Define access rights and select attributes for creating associations.

To add more than two attributes, as well as more than one assignment and association, the user should click the "Add Attribute," "Add Assignment," and "Add Association" buttons, respectively. After the user has input all the attributes, assignments, and associations, they should click the "Create PSC" button to create and save the policy.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/92f2f7fb-2f9d-4968-966d-29f52a7951aa" width="280" height="300" />

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/53349193-6514-4fc4-885e-afbbfaa0b928" width="280" height="300" />

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/5438d738-a4ef-4740-9b5a-9867c05ed334" width="280" height="300" />

Once the policy is saved, it cannot be edited. To create a new policy, the user needs to develop a new PSC. 

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/ed559253-7ffb-4dfa-89b7-9c0ceb13b2c4" width="280" height="300" />

Immediately after creating the attributes, assignments, and associations of the PSC, the DApp generates the corresponding privileges.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/95c843b6-dc15-46de-8de3-f895ed6a34b5" width="280" height="300" />

Register an object
-------
To register an object, you need to enter the URI where it is stored in the appropriate field, as well as its attributes. An object must have at least two attributes. In the implementation, the user is required to enter the attributes of the object, which have assignments associated with them. For example, the object "Object1" includes the attributes: (Object:Object1), (Project:Project1), and (Project:Projects).

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/37d495af-e7c7-4dd4-a518-c32e26035eb4" width="280" height="300" />

To complete the registration of an object, the user must click the "Create RSC" button. Once an object is created, it is displayed to the user and cannot be edited. However, it is possible to delete an object by entering the corresponding number assigned to the object in the table of stored objects and then pressing the "Delete RSC" button.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/76e6cd06-9a3b-48ef-81f9-92b26a40a3b4" width="280" height="300" />

Access Request
-------
To submit an access request for an object owned by another user, a user needs to enter their corresponding attributes. For example, to obtain the privilege (User1, r, Object1) and gain access to Object1, the user must enter the attributes User:User1. Additionally, the user is required to input the access right and the URI where the object is stored for which they want to request access.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/261c2c52-ef68-4f1e-b872-4160375304d7" width="280" height="300" />

By clicking the "Request Access" button, the DSC checks whether the user possesses the necessary access rights.

Access Control System Response
-------
The access control process consists of the following steps:

1. Initially, the DSC reads the URI contained in the user's access request. This URI is used to locate the corresponding PSC (Policy Specification Contract) in the DATSC database, which defines access policies for this URI.

2. Next, the DSC retrieves the privileges associated with the specific URI from the PSC.

3. The DSC then re-evaluates these privileges, searching for a privilege that matches the user's attributes, the access right requested by the user, and the URI where the object the user is requesting access to is stored.

4. Finally, based on the result of the evaluation, the DSC updates the user through the front-end, indicating whether access to the requested object is allowed ("Access succeed") or denied ("Access denied").

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/215231c5-f808-4f67-8cbb-d25c74597beb" width="500" height="300" />

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/c8031d72-b388-46af-9b00-5759e97e97dd" width="500" height="300" />

Functions (without prohibitions)
-------


The image visualizes all functions and provides insights into which functions are called by other functions.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/aa2be44b-2987-4172-a57e-496adf64fb61" width=" 650" height="450" />

Prohibitions
-------

To understand how prohibitions function, let's examine an example. Suppose we have the following privileges:

- User: User1, read, Object: Object1
- User: User1, write, Object: Object2
- User: User2, read, Object: Object1

In the prohibitions, we can use the * symbol for attributes Name and Value or accessrights. Thus, for example, with the prohibition (*:*, read, Object:Object1), all privileges granting the read permission to Object1 are revoked. It's also possible to directly revoke privileges from a specific user by setting a prohibition such as (User: User1, *, *:*). Alternatively, we can revoke a specific permission from a specific user on a particular object, as demonstrated by (User: User2, read, Object:Object1). In general, the * symbol serves as a wildcard.

The user invokes the frontend function createPSC, which conducts a series of checks and then calls crPSC. If the user has added prohibitions in the input fields, they are stored in the PSC. The function executePSC is called, which in turn invokes the function createPrivileges. If prohibitions have been saved, they are taken into account during the creation of privileges.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/8c410ff8-dffb-4238-b08c-504e489f76df" width="400" height="450" />


If the user wants to add additional prohibitions, he can input them into the designated field. The function updateProhibitions is then called. If there are no prohibitions in the designated fields, the process is halted. However, if prohibitions exist, the updateProhibitions function is invoked within the PSC, leading to the deletion of all privileges. The prohibitions are saved in the PSC, and the privileges are recreated.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/25cee27b-034b-4969-9170-08e2c708543a" width="400" height="450" />


Transformation and Adaptation Guide for DApp: Steps for Developers
-------
While modifying the React code does not require any additional steps from the developer, changing the smart contracts requires the implementation of various steps outlined in the code transformation diagram for smart contracts.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/1845cbbe-4239-45b7-985e-e56b83285171" width="350" height="700" />

The code transformation diagram requires the following steps:

1. Deploy a new DATSC on REMIX so that the old database is no longer used.
   
<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/1f2da67c-85b4-4248-b581-622582eba300" width="260" height="130" />

2. Storing the new address of DATSC in the code of the contracts RSC, PSC, and DSC to make them interact with the new database.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/9297c708-8e66-4674-adca-2df3f19ce099" width="600" height="140" />

3. Saving the new ABI and the address of DATSC in the React code.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/b9742a8b-405c-40d8-8987-416da32253dc" width="600" height="300" />

4. Saving the new ABI and the bytecode of RSC in the React code.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/6efc5faa-66e9-4e04-8e1b-f1375f4187d5" width="600" height="300" />

5. Saving the new ABI and the bytecode of PSC in the React code.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/06c90552-b2eb-4040-a643-7140d51034c2" width="600" height="300" />

6. Developing a new DSC.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/ab0ea07f-01aa-43de-9861-a7abaf07fe50" width="350" height="170" />

7. Storing the new ABI  and the address of the DSC in the REACT code.

<img src="https://github.com/StefGvxds/NGAC-Blockchain/assets/129869539/74c3f043-66a2-4bcb-8865-c43f8941379d" width="600" height="300" />

License
-------

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material
- **ShareAlike** — if you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.



Contact Information
-------
Email: stef.gvxds@gmail.com

















































