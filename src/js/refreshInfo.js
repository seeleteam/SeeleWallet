/*
Todo: 
for every 1 minute, 
first clear up the array to empty
recall again and again until all parts of the array are filled

[
  genesis, height, balances()
]


[
  [b],p,anchor,top
  [b],p,anchor,top
  [b],p,anchor,top
  [b],p,anchor,top
]
*/
// document.getElementById("demo").innerHTML = "Hello Worl);
function getBlockTime(){
  
}

function networkInfo(){
  
}

function refreshInfo(){
  //first break the account array into four to match our purposes, 
  //the most important part is actually the waiting part.
  // var response = ["","",[]]
  // 
  // if (response[0]==""){
  //   console.log("is empty, not good")
  //   console.log(seeleClient.accountArray)
  // }
  /*
    shard1: height (n s ago)
    genesis_is_indeed:
    peers
  */
  
  // I need the height, time, and genesis (no peer display)
  // var seelejs = require('seeleteam.js');
  // var client1 = new seelejs(seeleClient.address[1])
  // peers, anchor, top
  // client1.getPeerCount().then(result => {console.log(result)}, function(err) { console.log(err) });
  // client1.getInfo().then(result => {console.log(result)}, function() {});
  var time = new Date()
  document.getElementById("infoTime").innerHTML= `<span>`+time.toLocaleDateString()+`  `+time.toLocaleTimeString()+`</span>`
  
  const gensisHashes = [
    0,
    '0x4f2df4a21621b18c71619239c398657a23f198a40a8deff701e340e6e34d0823',
    '0x50dc657c1b2943d4d6d1ab23040e8cfdc7a3d34fa13bc95af1c569d1f07f66b8',
    '0x9100dd797bb7dd309ce7f132d389f1c6a50c728956eff0c2f878c0e67b5ecd2a',
    '0x17baaedc248777709511e9966719622fe11e4189825c5722f555bd292b6e84be'
  ]
  
  
  for (let i = 1; i<=4; i++){
    
    document.getElementById("netInfoTable").rows[i].cells[1].innerHTML = "N/A"
    document.getElementById("netInfoTable").rows[i].cells[2].innerHTML = seeleClient.address[i]
    
    seeleClient.getblock(i, "", 0, false, function (block,err) {
      if (err) {
        console.log(err)
      } else {
        if(block.hash == gensisHashes[i]){
          document.getElementById("netInfoTable").rows[i].cells[3].innerHTML = "✓"
        } else {
          document.getElementById("netInfoTable").rows[i].cells[3].innerHTML = "✕"
        }
      }
    });    
    seeleClient.getblock(i, "", -1, false, function (block,err) {
      if (err) {
        console.log(err)
      } else {
        var now = parseInt(Date.now().toString().slice(0,-3)) - block.header.CreateTimestamp
        document.getElementById("netInfoTable").rows[i].cells[4].innerHTML = block.header.Height+"("+now+"s ago)"
      }
    });
    
  }
}

document.getElementById("refreshInfo").addEventListener("click", refreshInfo);
document.getElementById("infoTime").addEventListener("click", showInfo);

function showInfo(){
  // console.log("why?")
  if (document.getElementById("netinfo").style.display == "none") {
    document.getElementById("netinfo").style.display = "block";
  } else {
    document.getElementById("netinfo").style.display = "none";
  }
}

