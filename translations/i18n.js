const path = require("path")
const electron = require('electron')
const fs = require('fs');
let loadedDictionary;
let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app
var remote = electron

module.exports = i18n;

function i18n() {
    const SeeleClient = require('./../src/api/seeleClient.js');
    var seeleClient = new SeeleClient;
    var settings = JSON.parse(fs.readFileSync(seeleClient.configpath), 'utf8')

    
    global.languageSetting = settings.lang;
    
    loadedLanguage = settings.lang;
    let langfile = loadedLanguage + '.json';
    if(fs.existsSync(path.join(__dirname, app.getLocale() + '.json'))) {
         loadedDictionary = JSON.parse(fs.readFileSync(path.join(__dirname, app.getLocale() + '.json'), 'utf8'))
    }
    else {
         loadedDictionary = JSON.parse(fs.readFileSync(path.join(__dirname, langfile), 'utf8'))
    }
}

i18n.prototype.__ = function(phrase) {
    let translation = loadedDictionary[phrase];
    if(translation === undefined) {
         translation = phrase;
         console.log(phrase, ": not translated");
    }
    return translation;
}

i18n.prototype.lang = function() {
  return loadedLanguage;
}

i18n.prototype.langChange = function(lang) {
  const SeeleClient = require('./../src/api/seeleClient.js');
  var seeleClient = new SeeleClient;
  var settings = JSON.parse(fs.readFileSync(seeleClient.configpath), 'utf8')
  settings.lang = lang;
  fs.writeFileSync(seeleClient.configpath, JSON.stringify(settings))
}
