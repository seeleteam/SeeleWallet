// Modules to control application life and create native browser window
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app
var mainMenu = require("./menu")

var SeeleClient = require('./src/api/seeleClient');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1280, height: 950, icon: './SeeleWallet_48.ico'})
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    sc = new SeeleClient();
    sc.initateNodeConfig(1);
    sc.initateNodeConfig(2);
    sc.initateNodeConfig(3);
    sc.initateNodeConfig(4);

    //Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
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
    if (!fs.existsSync(os.homedir()+'/.SeeleWallet/config.json')) {

      var err = shell.cp('-f', `${__dirname}/src/json/viewconfig.json`, os.homedir()+'/.SeeleWallet/')
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

    // const menu = Menu.buildFromTemplate(mainMenu.mainMenu)
    // mainWindow.webContents.openDevTools();
    // Menu.setApplicationMenu(menu)

    sc.init();

    // sc.StartNode(1,true).then((data)=>{
    //     console.log(data);
    // }).catch((data) => {
    //     console.log(data);
    // });
    // sc.StartNode(2,true).then((data)=>{
    //     console.log(data);
    // }).catch((data) => {
    //     console.log(data);
    // });
    // sc.StartNode(3,true).then((data)=>{
    //     console.log(data);
    // }).catch((data) => {
    //     console.log(data);
    // });
    // sc.StartNode(4,true).then((data)=>{
    //     console.log(data);
    // }).catch((data) => {
    //     console.log(data);
    // });

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
function createMenu() {
  const application = {
    label: "Application",
    submenu: [
      {
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const edit = {
    label: "Edit",
    submenu: [
      // {
      //   label: "Undo",
      //   accelerator: "CmdOrCtrl+Z",
      //   selector: "undo:"
      // },
      // {
      //   label: "Redo",
      //   accelerator: "Shift+CmdOrCtrl+Z",
      //   selector: "redo:"
      // },
      // {
      //   type: "separator"
      // },
      // {
      //   label: "Cut",
      //   accelerator: "CmdOrCtrl+X",
      //   selector: "cut:"
      // },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      // {
      //   label: "Select All",
      //   accelerator: "CmdOrCtrl+A",
      //   selector: "selectAll:"
      // }
    ]
  }

  const template = [
    application,
    edit
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', () => {
  createWindow()
  createMenu()
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
