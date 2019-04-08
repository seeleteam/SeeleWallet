# Seele Wallet 
[English](https://github.com/seeleteam/SeeleWallet/blob/master/README_English.md)                [中文](https://github.com/seeleteam/SeeleWallet/edit/master/README.md)

Seele wallet 是一款基于Seele的数字货币钱包，主要提供了Seele账户管理、转账和合约部署功能。
需要说明的是Seele wallet只是一个客户端应用程序，要连接到Seele网络，还需要您启动Seele节点服务。
后续将说明如何下载和使用Seele wallet。

## 使用之前说明：
   1. 如果是第一次使用，如果产生4个Shard端口无法连接的问题，那么请关掉SeeleWallet重启。
   2. 如果不是第一次使用出现节点无法连接任何节点而出现disconnected的错误，这个是属于正常现象。首先确保网络连接正常，要么继续等待连接，或者重新启动SeeleWallet，尝试新的连接。
   3. SeeletWallet使用的端口分别为：</br>
     shard1 ("http://localhost:8035");</br>
     shard2 ("http://localhost:8032");</br>
     shard3 ("http://localhost:8033");</br>
     shard4 ("http://localhost:8034");</br>


## 下载和安装

第一步请确保下载最新版本的Seele wallet，下载地址在这里：https://github.com/seeleteam/SeeleWallet/releases
根据您的操作系统选择对应的软件版本。


## Seele Node
Seele Wallet内包含Seele节点运行程序，可以连接到Seele网络。Seele节点运行程序所在目录：

**Windows**

SeeleWallet目录\resources\app\cmd\win32\node.exe

**Linux** 

SeeleWallet目录/resources/app/cmd/linux/node

**Mac**

SeeleWallet目录/resources/app/cmd/mac/node

Seele wallet启动时，会使用默认的配置自动启动Seele node服务。如果您希望连接到网络中其它节点，可以修改Seele node的配置文件。
配置文件在与Seele node 同级的config目录。Seele节点的运行配置请参考资料[How to customize your node configurations]
(https://seeleteam.github.io/seele-doc/docs/Getting-Started-With-Seele.html#how-to-customize-your-node-configurations)

在Seele node启动后，会同步网络中的区块数据，在您的设备上第一次启动Seele wallet时，可能会需要一定的时间用于同步区块数据，还请您耐心等待，直到确认当前分片的区块高度与主网区块高度一致。

## 账户管理
启动Seele wallet后，第一个Tab页Account对应于账户管理功能。

### 创建账户
点击Wallets页面下的Add Account，会弹出对话框，要求您输入密码，该密码是您已有进行转账交易时需要提供的，请牢记该密码。
（注：该密码只是用于您账户key file的密码，而非账户对应的私钥）
点击Ok后，您将可以在Accounts Overview下看到新增加了一个余额为0的账户。

#### 创建指定shard的账户
如果您需要创建指定shard下的账户，可以在创建账户时，选择对应的shard number。
在开始使用时，您可以忽略该步骤，这不会影响您后续的使用。

### 导出账户
导出和导入功能方便您在不同设备间使用Seele wallet账户。导出账户功能，可以将您的账户文件导出到指定的目录。点击Wallets标签页内右上角的 `export` 按钮可以实现导出。（注意不要修改文件名）

### 导入账户
导入账户，可以将您之前导出的账户文件导入到Seele wallet中。点击Wallets标签页内右上角的 `import` 按钮，并选择对应的已导出账户文件即可实现账户导入。(注意：导入的文件的文件名必须为Account，而且没有任何后缀名，比如 0x31d37d048e985362ae13073d298447fdd06a9541，0x31d37d048e985362ae13073d298447fdd06a9541.xxx不能使用)

### 账户详情
在Accounts Overview下显示的账户列表中，点击某个账户，可以进入到账户详情页面。
如果要返回账户列表，可以再次点击Wallets标签页。

**Transfer Seele & Tokens**
该功能将打开Send页面，实现从该账户发起的转账。

**View On Seelescan**
该功能将打开系统默认浏览器，并跳转到Seelescan网站，查看该账户的详细信息。

**Copy Address**
该功能将拷贝该账户地址到您的剪贴板中，你可以将其保存下来或者发送给他人。

**Show QR Code**
该功能将展示该账户地址对应的二维码。

## 转账

### 如何发起一笔转账
 - **选择账户：**
    首先在Wallets标签页内，选择您需要转出资金的账户，进入账户详情页后，点击Transfer Seele & Tokens，进入Send标签页内。此时该页面的From输入框的值即为您之前选择的账户地址。如果From和To的地址属于不同的shard，则会产生跨片交易，跨片交易的费用会比同片交易的费用高。关于Shard的更多信息，您可以参考该文档[Sharding in Seele](https://seeleteam.github.io/seele-doc/docs/Seele-sharding.html)
 - **输入目标账户地址：**
    在Send标签页内，输入以0x开头的目标账户地址。请注意核对该地址，一旦发起转账将不能退回。
 - **输入该账户密码：**
    输入您选择的转出资金账户对应的密码
 - **输入转账金额:**
    输入需要转出的金额，单位为Seele
 - **选择交易Gas Price:**
    根据您需要的转账交易确认时间，选择对应的gas price；如果希望您的交易尽快被确认，可以选择更高的gas price，当然这将花费更多的转账交易费。关于转账交易费的问题，您可以参考该文档[Seele Transaction Fee](https://seeleteam.github.io/seele-doc/docs/Seele-transaction-fee.html)
 - **点击Send：**
    `Total` 标签下显示的是您此次操作将转出的Seele总数，包括转账金额和交易手续费。在您确认所有信息都无误后，点击`Send`按钮发起转账交易。 转账成功后将提示发送交易成功以及本次交易hash，并可以在Wallets页面底部的Lastest Transactions列表中看到。
### 查看转账详情
Wallets 页面底部包含了通过Seele wallet发送的交易列表，这里只显示了交易hash。如果想查看转账详情，可以点击对应的hash值，这将打开系统默认浏览器，并跳转到Seele scan浏览器查询该交易hash的页面。

## 合约

### 部署合约
部署合约与发起转账交易类似，需要先选择账户。在Wallets标签页内，选择您部署合约的账户，进入账户详情页后，点击Transfer Seele & Tokens，点击Contract进入Send标签页内。此时该页面的From输入框的值即为您之前选择的账户地址。输入该账户对应的密码以及到合约的转账金额（默认为0)。

Seele wallet不提供合约编辑和调试的功能，您可以使用其它的工具进行合约的编写和测试，再将调试好的合约通过Seele wallet部署到Seele网络中。
- 如果提供的是Solidity contract source code，则需要点击右侧的`Complile`按钮编译合约，结果显示```Success```则表示编译成功，您可以点击contract byte code标签页，查看编译后对应的byte code。
- 如果提供的是合约编译后的字节码，则可以直接点击contract byte code标签页，将字节码内容粘贴到输入框内。

与发送转账交易类似，根据您的需要选择该笔交易的gas price。

`Total` 标签下显示的是您此次操作将消耗的Seele总数，包括转账金额和手续费。需要指出的是，只有在您使用contract source code并使用wallet编译合约时，才会计算该合约需要消耗的gas。直接提供byte code尚未提供估算gas费的功能，我们后期会改进该功能。

点击`Deploy`按钮将提交部署合约的请求，如果部署成功，将提示合约部署成功以及对应的交易hash。您可以在Wallets页面的Lastest Transactions 列表中看到本次交易hash。

### 查看合约部署结果
点击`Contract`标签页底部的`Query`按钮，可以根据交易hash查询合约部署结果。查询结果包含合约地址contract、部署结果failed(如果为false，则表明合约部署成功)等内容。

需要注意的是，查询合约结果时的From账户信息需要和您部署合约时的账户为同一个分片，否则查询不到对应的合约信息。



## 开发者相关

**Data folder**

The data folder for SeeleWallet is `~/.SeeleWallet`

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

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

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
