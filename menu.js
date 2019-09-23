const { Menu, shell, app, BrowserWindow } = require('electron');
global.languageSetting = "cn";
var i18n = new(require('./translations/i18n'));
// const mainWindow = require('./main.js').mainWindow


let template

function generateTemplate(){
  mainWindow = BrowserWindow.getAllWindows()
  console.log("On ready", mainWindow)
  
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
          label: i18n.__("View Keyfile(s)"),
          click: () => {
            shell.openItem(sc.accountPath);  
          }
        },
        // {
        //   label: i18n.__("Import Keyfile(s)")
        // 
        // },
        // {
        //   label: i18n.__("Export Keyfile(s)")
        // }
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
        language
      ]
    }

    const help = {
      label: i18n.__("Help"),
      role: "help",
      submenu: [
        {
          label: i18n.__('Learn More'),
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
      // view,
      help
    ]
    return template
}

// generateTemplate();

app.on('ready', () => {
  // generateTemplate();
  // const menu = Menu.buildFromTemplate(template);
  // // console.log(menu);
  // Menu.setApplicationMenu(menu);
})


// app.on('browser-window-created', () => {
// mainWindow = BrowserWindow.getAllWindows()
//   console.log("Should be created right?", BrowserWindow.getAllWindows())
//   generateTemplate();
//   const menu = Menu.getApplicationMenu()
//   // console.log(menu);
//   if (!menu) return
// 
// })

// module.exports = generateTemplate;