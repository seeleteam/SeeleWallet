// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');
var fs = require('fs');
console.log(`createAccount is in ${__dirname}`)

seeleClient = new SeeleClient();

// onload = function() {
//     document.getElementById("createKey").addEventListener("click", generateKey);
// }

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

function passwordStrengthTest(password){
  const fs = require('fs');
  
  var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
  const lang = document.getElementById("lang").value
  // length, case, number, specialchar
  var err = []
  const len = password.length
  
  if (len < 10) { err.push(json[lang]["passwordWarning"]["length"]);}
  if (password.toLowerCase()==password) { err.push(json[lang]["passwordWarning"]["uppercase"]) }
  if (!/[a-zA-Z]/.test(password)) { err.push(json[lang]["passwordWarning"]["letter"]) }
  if (!/\d/.test(password)) { err.push(json[lang]["passwordWarning"]["number"]) }
  if (/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/.test(password)) { err.push(json[lang]["passwordWarning"]["specialChar"]) }
  var errmsg = []
  if (err.length != 0) {
    errmsg = [json[lang]["passwordWarning"]["fail"]].concat(err);
    console.log(errmsg)
  }
  return errmsg
}

addLoadEvent(function() {
    console.log("shit!")
    document.getElementById("createKey").addEventListener("click", generateKey, {once : true});
})

function generateKey() {
    var shard = document.getElementById("shardnum")
    var passWord = document.getElementById("passWord")
    
    var result = passwordStrengthTest(passWord.value);
    if(result.length!=0){
      var alertmsg = result[0];
      for (i = 1; i < result.length; i++ ){
        alertmsg += "\n"+result[i];
      }
      alert(alertmsg)
      location.reload();
      return
    }

    layer.load(0, { shade: false });

    seeleClient.generateKey(shard.value, passWord.value).then((outdata) => {
        setInterval(function() {
            if (fs.existsSync(seeleClient.accountPath + outdata.slice(0,42).trim())) {
                layer.closeAll();
                window.location.reload();
            }
        }, 1000, "Interval");
        const { dialog } = require('electron').remote;
        const lang = document.getElementById("lang").value;
        const fs = require('fs');
        var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
        const createwarning1 = json[lang]["saveWarning1"];
        const createwarning2 = json[lang]["saveWarning2"];
        const ok = json[lang]["ok"];
        dialog.showMessageBox({ 
          type: "warning",
          message: createwarning1+outdata.slice(0,42)+createwarning2+outdata.slice(42),
          buttons: [ok] });
    }).catch(err => {
        alert(err)
    });
}