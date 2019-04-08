# SeeleWallet

[English](https://github.com/seeleteam/SeeleWallet/blob/master/README_English.md)                [中文](https://github.com/seeleteam/SeeleWallet/blob/master/README.md)

SeeleWallet is a digital wallet based on Seele coins, allowing users to manage accounts, make transactions and contracts. Please be informed that SeeleWallet is only a client side application that needs to connect to Seele's main net, which is done through your local execution of a Seele node. The following is instructions on how to download and use SeeleWallet. 

## Foreknowledge:
1. If a node fails to connect to other nodes and informs you of the error message "disconnected," know that this is completely normal. Wait for the node to connect or restart SeeleWallet to initiate the connecting process again.

2. The ports that SeeleWallet uses are: </br>
Shard1 ("http://localhost:8035")</br>
Shard2 ("http://localhost:8032")</br>
Shard3 ("http://localhost:8033")</br>
Shard4 ("http://localhost:8034")</br>

## Download and Install

Please first make sure you download the newest version of SeeleWallet, The link to the address is [here]("https://github.com/seeleteam/SeeleWallet/releases") choose your version of application depending on your operating system.

## Seele Node

SeeleWallet includes Seele nodes that runs behind screen to connect to the p2p network. The location of Seele nodes are as below:

**Windows**

\resources\app\cmd\win32\node.exe

**Lniux**

/resources/app/cmd/linux/node

**Mac**

/resources/app/cmd/mac/node

When SeeleWallet is started, it will use the default configurations to start your node services. If you wish to connect your node to specific nodes, you may change your seele nodes' configuration files. The configuration files are located in the same directory as your node executable, refer to our guide in [How to configure your node]("https://seeleteam.github.io/seele-doc/docs/Getting-Started-With-Seele.html#how-to-customize-your-node-configurations") for further instructions.

When SeeleWallet is started, the first tab for accounts matches account management features.

## Create Accounts

Click "Add Account" on SeeleWallet's first page and a dialog asking for your password will pop up. The password is the password you used to create your keyfile, please remeber it and please be aware that it is not your private key. Once you've clicked OK, you will see a new account with 0 balance in your Accounts Overview.

### Create accounts with specified shard number

IF you want to create an account with a specific shard number, you can make the choice while creating your account. In the beginning of your use, you can ignore this step. It will not impact your future uses.

## Export Accounts

Export and import features will allow you to use accounts across machines. The export feature allows you to specify where to export your file. Click on SeeleWallet's top right export button to export. (don't change your file's name)
## Import Accounts
The import feature can import accounts which you've exported. Click on SeeleWallet's top right import button to import from the matching account files. (The name of your keyfile must be the account public key it contains without any post fixes).

## Account Details
In the list of accounts shown below Accounts Overview, you may enter an  account's detail page. Click on wallet again to return to the page before.
<br/> **Transfer Seele & Tokens** redirects you to the Send-age. 
<br/> **View on SeeleScan** opens SeeleScan with your default browser
<br/> **Copy Address** copies your account number to clip board
<br/> **Show QR Code** shows the qr code matching this 

# Transaction
## How to send a transaction
* **Choose Sender Account:** First select the account from which you want to transfer money. After clicking into account details page, click "Transfer Seele & Tokens," enter "Send" page. At this point, the "From" Bok will be the account address you chose. If the accounts in "From" and "To" are in different shards, a cross-shard transaction will happen, and the fee for cross-shard transactions will be relatively higher than same-shard transaction. For more information on sharding you can refer to [Sharding in Seele]("https://seeleteam.github.io/seele-doc/docs/Seele-sharding.html").
* **Enter Reciever Account:** Make sure writing the correct address starting with "0x" as transactions can't be undone.
* **Enter Sender Account Password:** Enter sender account keyfile password.   
* **Enter Transfer Amount:** in units of Seele
* **Choose Gas Price:** Choose your gas price depending on how fast you need your transactions to be made; you may set a higher fee if you wish to have your transactions to be made faster. About transaction fees, you may refer to [Seele Transaction Fee]("https://seeleteam.github.io/seele-doc/docs/Seele-transaction-fee.html") for more information.

## View Transaction Details
The bottom of SeeleWallet's Wallet tab contains a list of transactions made from SeeleWallet. This list only shows the hash of these transactions. Click the hash to learn more details of these transactions: you'll be redirected to SeeleScan's matching page for this transaction with your default browser.

# Contracts
## Deploy Contract
Deploying a contract is similar to sending a transaction. First, choose your sender account in your wallet tab. Click "Transfer Seele & Tokens," and then click to enter your contract tab. The sender account should be the one you chose. Then, enter your account password and the fee for the contract, which is defaulted to be 0.

SeeleWallet does not provide contract editing or debugging features. You may use other tools to do so and copy your contract to deploy into Seele's main net. 
* If you're providing Solidity contract source code, click the compile button on the right. If the result shows success, then you've compiled your binaries and may look at it in the "contract byte code" page.
* IF you're providing pre-compiled binary code, you may paste it directly to the "contract byte code" page.

Similar to sending transactions, you'll need to choose your gas price depending on your needs.

The number below the "Total" tag shows the cost in Seele to deploy this contract, including transaction amount and fee. Please be informed only when you compile source code in the wallet compiler will it actually calculate the gas fee for you correctly. We will improve in supporting estimating gas fee for precompiled code in the future. 

Click "Deploy" to submit deploy application. If contract is deployed successfully, you'll see the hash for this transaction in Wallet tab's list of "Latest Transactions."

## Check Deploy results
Click Contract tab's Query button, and you can search your deployment result with its hash from the Wallet tab. The search result will return contract address, and deployment failure (display false if success).

Worth mentioning that when searching, your default account needs to be in the same shard as the your sender account for contract deployment. You won't find your contract otherwise.  


# About Developers

**Data folder**
The data folder for SeeleWallet  is ~/.SeeleWallet

# To Use
To clone and run this repository you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/seeleteam/SeeleWallet.git
# Go into the repository
cd SeeleWallet
# Install dependencies
npm install
# Run the app
npm start
```

# License 

[CC0 1.0(Public Domain)](LISENSE.md)
