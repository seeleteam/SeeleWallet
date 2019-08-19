
var SeeleClient = require('../api/seeleClient');

seeleClient = new SeeleClient();
console.log("is this executed at all?")

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
    //when index.html/lang is clicked
    //1. initiate reload, intiate io saving  
    //   loads with lang.json's, 
    //2. after io saving do session saving
    //get element
    const fs = require('fs');
    console.log(process.cwd());
    var json = JSON.parse(fs.readFileSync(process.cwd()+'/src/js/lang.json').toString());
    console.log()
    var literals = document.getElementsByClassName("lit");
    const lang = document.getElementById("lang").value
    console.log(lang)
    for (i = 0; i < literals.length; i++) {
        console.log(literals[i].id);
        // literals[i].innerHTML = "nono";
        
        literals[i].value = json[lang][literals[i].id];
        literals[i].innerHTML = json[lang][literals[i].id];
        literals[i].placeholder = json[lang][literals[i].id];
    }
    // fetch("../lang.json") 
    // .then(response => response.json())
    // .then(json => console.log(json));
    // location.reload(false);
}
// 