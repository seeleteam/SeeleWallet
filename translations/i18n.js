const path = require("path")
const electron = require('electron')
const fs = require('fs');
let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app
var remote = electron

module.exports = i18n;

function i18n() {
    let langfile = global.languageSetting+'.json';
    if(fs.existsSync(path.join(__dirname, app.getLocale() + '.json'))) {
         loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, app.getLocale() + '.json'), 'utf8'))
    }
    else {
         loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, langfile), 'utf8'))
    }
}

i18n.prototype.__ = function(phrase) {
    let translation = loadedLanguage[phrase];
    if(translation === undefined) {
         translation = phrase;
         console.log(phrase, ": not translated");
    }
    return translation;
}
