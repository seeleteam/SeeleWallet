const electron = require('electron')

var mainMenu = [{
    label: '编辑',
    submenu: [{
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
    }, {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
    }, {
        type: 'separator'
    }, {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    }, {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    }]
}, {
    label: '帮助',
    role: 'help',
    submenu: [{
        label: '开发者工具',
        accelerator: 'CmdOrCtrl+Shift+I',
        role: 'copy'
    }, {
        label: '学习更多',
        click: function() {
            electron.shell.openExternal('http://www.baidu.com')
        }
    }]
}];

module.exports.mainMenu = mainMenu;