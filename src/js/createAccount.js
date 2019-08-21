// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var SeeleClient = require('../api/seeleClient');
var fs = require('fs');

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
        var json = JSON.parse(fs.readFileSync(process.cwd()+'/src/js/lang.json').toString());
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