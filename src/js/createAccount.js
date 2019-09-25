// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');
var fs = require('fs');
// console.log(`createAccount is in ${__dirname}`)

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

addLoadEvent(function() {
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
        const createwarning0 = json[lang]["saveWarning0"];
        const createwarning1 = json[lang]["saveWarning1"];
        const createwarning2 = json[lang]["saveWarning2"];
        const ok = json[lang]["ok"];

        // This is a chromium only solution, does not work in other browsers
        const message = createwarning1+outdata.slice(0,42)+createwarning2+outdata.slice(42);
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
          if (result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(message).then(
              function() {
              console.log("copied!")
            }, function() {
              console.log("failed, but still permitted")
            });
          }
        });

        dialog.showMessageBox({
          type: "warning",
          message: createwarning0+message,
          buttons: [ok]
        });

    }).catch(err => {
        alert(err)
    });
}

function importAccounts(){
  const { dialog } = require('electron').remote
  const fs = require('fs')
  const srcpath = dialog.showOpenDialog(
    { properties: ['openFile', 'multiSelections'],
    // { properties: ['multiSelections'],
      buttonLabel: 'Import from'}
  )
  dstpath = seeleClient.accountPath
  const path = require('path')
  for (var item in srcpath) {
    //console.log(srcpath[item])
    var tempfilename = srcpath[item].split(path.sep)
    //console.log(dstpath+tempfilename[tempfilename.length-1])
    fs.copyFile(srcpath[item], dstpath+tempfilename[tempfilename.length-1], (err) => {
      if (err) throw err;
      //console.log('import sucess for ' + item + srcpath[item] + "to" + dstpath);
    });
  }
  var refreshAccount = require('./getBalance.js');
  refreshAccount();
  // window.location.reload();
}
