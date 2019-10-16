// Modules to control application life and create native browser window
const {
  shell,
  BrowserWindow,
  Menu,
  app,
  ipcMain
} = require('electron');
ipcMain.on( 'compileContract', ( event, input ) => {
  // console.log(input);
  var solc = require('solc');
  var solc = solc.setupMethods(require("./src/api/solidity.js"))
  var output = JSON.parse(solc.compile(JSON.stringify(input)))
  // console.log(output.contracts['test.sol']);
  // console.log(output.errors);
  var err = output.errors;
  var byt;
  var e = 0;
  for (var contractName in output.contracts['test.sol']) {
    if (e == 0) {
      byt = output.contracts['test.sol'][contractName].evm.bytecode.object;
      // console.log(contractName + ': ' + byt);
      abi = output.contracts['test.sol'][contractName].abi;
      e = 1;
    }
  }
  event.sender.send('compiledContract', byt, abi, err);
    
  // event.sender.send('compiledContract', bytecode);
} );

const SeeleClient = require('./src/api/seeleClient');
const createMenu = require('./src/js/menu.js').createMenu;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
global.languageSetting = "cn";

function createWindow() {
    // Browser window
    mainWindow = new BrowserWindow({width: 1200, height: 1050, icon: __dirname + '/build/icon.png', resizable: true})
    
    // Window content
    mainWindow.loadFile('index.html')
    
    // Connect to four nodes
    sc = new SeeleClient();
    // sc.initateNodeConfig(1);
    // sc.initateNodeConfig(2);
    // sc.initateNodeConfig(3);
    // sc.initateNodeConfig(4);
    
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
    
    sc.init();

}


app.on('ready', () => {
  createWindow();
  createMenu(mainWindow);
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

