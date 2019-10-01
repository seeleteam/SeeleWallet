var i18n = new(require('./../../translations/i18n'))
const { Menu, app } = require('electron')

function createTemplate (mainWindow) {
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
      // {
      //   label: i18n.__("Manage Keyfile(s)"),
      //   accelerator: "CmdOrCtrl+M",
      //   click: () => {
      //     shell.openItem(sc.accountPath);  
      //   }
      // },
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
          console.log(Menu);
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
      language,
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
  
  const template = [
    application,
    file,
    edit,
    view,
    help
  ]
  
  // return 
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}


module.exports.createTemplate = createTemplate