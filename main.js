// Modules to control application life and create native browser window
const {
  shell,
  BrowserWindow,
  Menu,
  app,
  ipcMain
} = require('electron')
ipcMain.on( "setMyGlobalVariable", ( event, myGlobalVariable ) => {
  global.myGlobalVariable = myGlobalVariable;
} );
const SeeleClient = require('./src/api/seeleClient');
const m = require('./src/js/menu.js').createTemplate;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
global.languageSetting = "cn";

function createWindow() {
    // Browser window
    mainWindow = new BrowserWindow({width: 1200, height: 1050, icon: './build/SeeleWallet_48.ico', resizable: true})
    
    // Window content
    mainWindow.loadFile('index.html')
    
    // Connect to four nodes
    sc = new SeeleClient();
    sc.initateNodeConfig(1);
    sc.initateNodeConfig(2);
    sc.initateNodeConfig(3);
    sc.initateNodeConfig(4);

    // Settup Local structure
    const os = require("os")
    const shell = require('shelljs');
    const fs = require('fs');

    if (!fs.existsSync(os.homedir()+'/.SeeleWallet')){
      fs.mkdirSync(os.homedir()+'/.SeeleWallet', { recursive: true }, (err) => {if (err) throw err;})
    }
    if (!fs.existsSync(os.homedir()+'/.SeeleWallet/tx')) {
      fs.mkdirSync(os.homedir()+'/.SeeleWallet/tx', { recursive: true }, (err) => {if (err) throw err;})
    }
    if (!fs.existsSync(os.homedir()+'/.SeeleWallet/account')) {
      fs.mkdirSync(os.homedir()+'/.SeeleWallet/account', { recursive: true }, (err) => {if (err) throw err;})
    }
    if (!fs.existsSync(os.homedir()+'/.SeeleWallet/viewconfig_1.0.json')) {
      var err = shell.cp('-f', `${__dirname}/src/json/viewconfig_1.0.json`, os.homedir()+'/.SeeleWallet/')
      // console.log(err)
    }
    if (!fs.existsSync(os.homedir()+'/.SeeleWallet/lang.json')) {

      var err = shell.cp('-f', `${__dirname}/src/json/lang.json`, os.homedir()+'/.SeeleWallet/')
      // console.log(err)
    }
    
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
    
    sc.init();

}


app.on('ready', () => {
  createWindow()
  m(mainWindow)
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

