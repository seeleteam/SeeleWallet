// Modules to control application life and create native browser window
const electron = require('electron')
const shell = electron.shell
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app
var mainMenu = require("./menu")
const ipcMain = electron.ipcMain
ipcMain.on( "setMyGlobalVariable", ( event, myGlobalVariable ) => {
  global.myGlobalVariable = myGlobalVariable;
} );

var SeeleClient = require('./src/api/seeleClient');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function createWindow() {
    // Browser window
    mainWindow = new BrowserWindow({width: 1200, height: 1050, icon: './SeeleWallet_48.ico', resizable: true})
    
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
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
// function changeConfig(configName, configValue){
// 
// }
global.languageSetting = "cn";
var i18n = new(require('./translations/i18n'))
function createMenu() {
  const application = {
    label: i18n.__("SeeleWallet"),
    submenu: [
      {
        label: i18n.__("Developer Options"),
        accelerator: "CmdOrCtrl+shift+I",
        click: () => {
          mainWindow.webContents.openDevTools()
        }
      },
      {
        type: "separator"
      },
      {
        label: i18n.__("Quit"),
        accelerator: "CmdOrCtrl+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const file = {
    label: i18n.__("File"),
    submenu:[
      {
        label: i18n.__("Create Keyfile(s)"),
        accelerator: "CmdOrCtrl+N",
        click: () => {
          // console.log("clicked");
          mainWindow.webContents.executeJavaScript('addKeyfilePopup()');
            // mainWindow.webContents.executeJavaScript('importAccounts()')
        }
      },
      {
        label: i18n.__("Manage Keyfile(s)"),
        accelerator: "CmdOrCtrl+M",
        click: () => {
          shell.openItem(sc.accountPath);  
        }
      },
      {
        label: i18n.__("Import Keyfile(s)"),
        accelerator: "CmdOrCtrl+I",
        click: () => {
            // var importKey = require('./src/js/index.js');
            mainWindow.webContents.executeJavaScript('importAccounts()')
            // importKey();
            // console.log("really")
        }
      }
    ]
  }

  const edit = {
    label: i18n.__("Edit"),
    submenu: [
      {
        label: i18n.__("Copy"),
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: i18n.__("Paste"),
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: i18n.__("Refresh"),
        accelerator: "CmdOrCtrl+R",
        click: function () {
          mainWindow.reload();
        }
      }
    ]
  }

  const language = {
    label:"Language",
    submenu: [
      {
        label: "English",
        type: "radio",
        click: function () {
          global.languageSetting = "en"
          console.log("switch to English!", global.languageSetting);
        }
      },
      {
        label: "中文",
        type: "radio",
        click: function () {
          global.languageSetting = "cn"
          console.log("转成中文!", global.languageSetting);
        },
      }
    ]
  }

  const view = {
    label: i18n.__("View"),
    submenu: [
      // language
      {
        label: i18n.__("Show NetWork Info"),
        accelerator: "CmdOrCtrl+E",
        click: () => {
          mainWindow.webContents.executeJavaScript('showInfo()')
        }
      }
    ]
  }

  const help = {
    label: i18n.__("Help"),
    role: "help",
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require("electron")
          await shell.openExternal("https://seele-seeletech.gitbook.io/wiki/tutorial/seelewallet-windows")
        }
      },
      {
        label: "了解更多",
        click: async () => {
          const { shell } = require("electron")
          await shell.openExternal("https://seele-seeletech.gitbook.io/wiki/chinese/seelewallet-windows")
        }
      }
    ]
  }

  template = [
    application,
    file,
    edit,
    view,
    help
  ]
  // module.exports.mainWindow = mainWindow;
  // console.log('exported!',mainWindow)
  // const menutest = require('./menu');
  // console.log(menutest.mainMenu)
  // Menu.setApplicationMenu(Menu.buildFromTemplate(menutest.mainMenu));
  // console.log(template)
  // setInterval(() => {Menu.setApplicationMenu(Menu.buildFromTemplate(template)), console.log("intervalset");}, 2000);
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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
