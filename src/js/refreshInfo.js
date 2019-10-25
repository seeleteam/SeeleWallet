// const fs = require('fs'); declared already?

addLoadEvent(firstLoad);
// document.getElementById("refreshInfo").addEventListener("click", refreshInfo);
// document.getElementById("infoTime").addEventListener("click", showInfo);

function addLoadEvent(func){
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            document.getElementById("infoTime").addEventListener("click", showInfo);
            func();
        }
    }
}


function firstLoad(){
    var interval = setInterval(function(){
        refreshInfo();
    }, 1000);
}

function refreshInfo(){
  var time = new Date();
  document.getElementById("infoTime").innerHTML= `<span>`+time.toLocaleDateString()+`  `+time.toLocaleTimeString()+`</span>`

  const gensisHashes = [
    0,
    '0x4f2df4a21621b18c71619239c398657a23f198a40a8deff701e340e6e34d0823',
    '0x50dc657c1b2943d4d6d1ab23040e8cfdc7a3d34fa13bc95af1c569d1f07f66b8',
    '0x9100dd797bb7dd309ce7f132d389f1c6a50c728956eff0c2f878c0e67b5ecd2a',
    '0x17baaedc248777709511e9966719622fe11e4189825c5722f555bd292b6e84be'
  ]


  for (let i = 1; i<=4; i++){
    seeleClient.getInfo(i, function(info, err) {
        addressMessage = `${seeleClient.address[i]}(` + info.Version + ")"
        document.getElementById("netInfoTable").rows[i].cells[2].innerHTML = addressMessage;
    });
    
    seeleClient.getblock(i, "", -1, false, function (block,err) {
      if (err) {
        console.log(err);
        document.getElementById("netInfoTable").rows[i].cells[1].innerHTML = "✕";
        document.getElementById("netInfoTable").rows[i].cells[1].style.color = 'red';
      } else {
        document.getElementById("netInfoTable").rows[i].cells[1].innerHTML = "✓";
        document.getElementById("netInfoTable").rows[i].cells[1].style.color = 'green';
        var now = parseInt(Date.now().toString().slice(0,-3)) - block.header.CreateTimestamp;
        document.getElementById("netInfoTable").rows[i].cells[3].innerHTML = block.header.Height+"("+now+"s ago)";
      }
    });

  }
}

function showInfo(){
  if (document.getElementById("netinfo").style.display == "none") {
    document.getElementById("netinfo").style.display = "block";
  } else {
    document.getElementById("netinfo").style.display = "none";
  }
}

function closeNodePop(){
  document.getElementById("nodepopup-panel").style.display = "none";
  document.getElementById("dask").style.display = "none";
}

function toggleEditNetwork(){
  if (document.getElementById("nodepopup-panel").style.display == "none") {
    document.getElementById("nodepopup-panel").style.display = "block";
    document.getElementById("dask").style.display = "block";
    document.getElementById("dask").onclick = closeNodePop
  } else {
    closeNodePop()
    document.getElementById("dask").onclick = null
  }
}

function saveNodeInfo(){
  var nodeinputs = document.getElementsByClassName("nodeInput")
  for ( var i = 0 ; i < nodeinputs.length ; i++ ) {
    ipport = nodeinputs[i].value
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?:(0|[1-9][0-9]?[0-9]?[0-9]?[0-9]?))$/.test(ipport)) {  
      console.log("change address shard ", i+1, " to ", ipport );
      if ( true ) {
        document.getElementById(`shard${parseInt(i)+1}address`).innerHTML = ipport;
      }
      // save it to the config file, when user refreshest the whole app, this will complete with 
      var settings = JSON.parse(fs.readFileSync(seeleClient.configpath), 'utf8')
      // console.log(settings.connect[i+1]);
      settings.connect[i+1] = `http://${ipport}`;
      // console.log(settings.connect[i+1]);
      // console.log(settings);
      fs.writeFileSync(seeleClient.configpath, JSON.stringify(settings))
      
    } else if (ipport.toString()=="") {
      console.log("empty entry for shard", i+1);
    } else {
      console.log("Invalid ip:port:", ipport);
      $('.nodepopup').addClass("smh")
      setTimeout(function(){ $('.nodepopup').removeClass("smh"); }, 200);
    }
  }
}

function refreshNodeInfo(){
  alert("refresh!")
}
