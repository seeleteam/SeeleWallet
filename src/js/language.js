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
        if (literals[i].type == "password" || literals[i].type == "text" ) {
          // console.log(literals[i]);
          literals[i].placeholder = json[lang][literals[i].id];
          // console.log(literals[i])
          // console.log(literals[i].type)
          
        } else {
          literals[i].value = json[lang][literals[i].id];
          literals[i].innerHTML = json[lang][literals[i].id];
          // console.log(literals[i]);
        }
        // literals[i].placeholder = json[lang][literals[i].id];
    }
    
    //2. transalate accounts' descriptions
    var accounts = document.getElementsByClassName("shardword")
    for (i = 0; i < accounts.length; i++) {
      accounts[i].innerHTML = json[lang]["shard"]
    }
    
    var accounts = document.getElementsByClassName("sendword")
    for (i = 0; i < accounts.length; i++) {
      accounts[i].innerHTML = json[lang]["tabSend"]
    }
    
    //3. transalate transaction records' descriptions
    var records = document.getElementsByClassName("tx-done-word")
    for (i = 0; i < records.length; i++) {
      // records[i].innerHTML
      records[i].innerHTML = json[lang]["tx-done-word"];
      // console.log(records[i]);
    }

    //4. translate form validators
    // var validator;
    // var ctxvalidator;
    // $('#span_balance').
    // console.log(lang);
    $('form[id="txform"]').validate({
    // $('form[id="txform"]').validate({
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
    // console.log($('form[id="txform"]').validate());
    // if ( jQuery.isReady ) {  
    // // fn.call( document, jQuery );
    //   console.log("u");
    //   validator;
    // } 
    // validator2 = 
    
    $('form[id="contractForm"]').validate({
        ignore: [],
        rules: {
            contractPublicKey: "required",
            contractAddress: {
              rangelength:[42,42]
            },
            contractAccountpassWord: {
                required:true
            },
            contractAmount:{
                required:true,
                number:true,
                fixedPrecision:9
            }
        },
        messages: {
            contractPublicKey:json[lang]["warning_txpublicKey"],
            contractAddress: json[lang]["warning_ContractAddress"],
            contractAccountpassWord:{
                required:json[lang]["warning_accountpassword_required"]
            },
            contractAmount:{
                required:json[lang]["warning_amount_required"],
                number:json[lang]["warning_amount_number"],
                fixedPrecision:json[lang]["warning_amount_fixedPrecision"]
            }
        }
        // ,
        // errorPlacement: function(error, element) {
        //     error.insertAfter($(element).parent());
        // }
      });
}

module.exports.switchLanguage = switchLanguage
