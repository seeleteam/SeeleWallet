# SeeleWallet

### Intro
![alt text](build/icon.ico)


SeeleWallet is Seele's open-source wallet, which runs on OSX, Windows and Linux, for transaction and contract sending over Seele's Mainnet.

### User

[Tutorial](https://seele-seeletech.gitbook.io/wiki/tutorial/seelewallet)

[Download](https://github.com/seeleteam/seelewallet/releases/latest)


### Developer

**Clone, Run, Package**

```bash
# Clone Repo
git clone https://github.com/seeleteam/SeeleWallet.git
# Enter Repo
cd SeeleWallet
# Install Dependencies
npm install
# Run SeeleWallet
npm start

# on mac package darwin x64
npm run pac-mac
# on linux package linux x64
npm run pac-lin
# on windows package win32 x64
npm run pac-win
```
**Data folder**
```bash
~/
└── .SeeleWallet/
    ├── account/
    ├── node/
    ├── rc/
    ├── tx/
    ├── lang.json
    └── viewconfig.json
```
**Feature Workflow**
```
  Manage Account
   Generate by shard number 1-4 
   Generate by private-key 1-4 
   Import account 
   Move Out 
 Export Account Info
   Unlock & Copy private-key
   Copy account
   Copy publickey
 Transactions
   Shard [1,4]x[1,4] 
   Record Display
 Contracts
   Shard 1-1, 2-2, 3-3, 4-4 
   Deploy & Results
   Employ & Results
 View
   Fullscreen, minimize, developer
   Language
   Network
```


# License 

[CC0 1.0(Public Domain)](md/LISENSE.md)
