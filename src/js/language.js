
var SeeleClient = require('./src/api/seeleClient');

seeleClient = new SeeleClient();

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

addLoadEvent(function() {
    document.getElementById("lang").addEventListener("click", switchLanguage);
})

document.addEventListener('DOMContentLoaded', function () {
    switchLanguage();
}, false);

function switchLanguage() {
    const fs = require('fs');
    var json = JSON.parse(fs.readFileSync('./src/js/lang.json').toString());
    const lang = document.getElementById("lang").value
    var literals = document.getElementsByClassName("lit");
    console.log(process.cwd());
    console.log(lang)
    for (i = 0; i < literals.length; i++) {
        literals[i].value = json[lang][literals[i].id];
        literals[i].innerHTML = json[lang][literals[i].id];
        literals[i].placeholder = json[lang][literals[i].id];
    }
}