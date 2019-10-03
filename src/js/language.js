var SeeleClient = require('./src/api/seeleClient');
const seeleClient = new SeeleClient();

// console.log(`Language is in ${__dirname}`)
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
    // var SeeleClient = require('./src/api/seeleClient');
    if ( seeleClient == undefined) {
      var SeeleClient = require('./src/api/seeleClient');
      seeleClient = new SeeleClient();
    }
    
    //1. transalate html elments described by id's
    const fs = require('fs');
    var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
    var settings = JSON.parse(fs.readFileSync(seeleClient.configpath), 'utf8')
    const lang = settings.lang;
    var literals = document.getElementsByClassName("lit");
    for (i = 0; i < literals.length; i++) {
        literals[i].value = json[lang][literals[i].id];
        literals[i].innerHTML = json[lang][literals[i].id];
        literals[i].placeholder = json[lang][literals[i].id];
    }
    
    //2. transalate accounts' descriptions
    var accounts = document.getElementsByClassName("lit-account")
    for (i = 0; i < accounts.length; i++) {
      accounts[i].innerHTML = json[lang]["account"]
    }
    
    //3. transalate transaction records' descriptions
    var shards = document.getElementsByClassName("lit-shard")
    for (i = 0; i < shards.length; i++) {
      shards[i].innerHTML = json[lang]["shard"]
    }

    //4. translate form validators
    validator = $('form[id="txform"]').validate({
        // Specify validation rules
        rules: {
          // The key name on the left side is the name attribute
          // of an input field. Validation rules are defined
          // on the right side
          txpublicKey: "required",
          to: {
              required:true,
              rangelength:[42,42]
          },
          accountpassword: {
              required:true
          },
          amount:{
              required:true,
              number:true,
              fixedPrecision:9
          }
        },
        // Specify validation error messages
        // publickey: 0xe1e3f55628ac137f34da83b2d24aa55066247f81
        // privatekey: 0x95adf50a30eceaf5e6d615ffbfcddf7a1ac1f99677f4e132d52dddc2e8ac2638
        messages: {
            txpublicKey:json[lang]["warning_txpublicKey"],
            to: {
                required:json[lang]["warning_to_required"],
                rangelength:json[lang]["warning_to_rangelength"]
            },
            accountpassword:{
                required:json[lang]["warning_accountpassword_required"]
            },
            amount:{
                required:json[lang]["warning_amount_required"],
                number:json[lang]["warning_amount_number"],
                fixedPrecision:json[lang]["warning_amount_fixedPrecision"]
            }
        }
      });

}

module.exports.switchLanguage = switchLanguage