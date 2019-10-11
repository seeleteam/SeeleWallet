/*
author: Miya_yang
date:2018.10.30
*/

var refreshAccount = require('./src/js/getBalance.js');

$(function ($) {

    // tab
    $('#tab').tabulous({
        effect: 'slideLeft'
    })

    // password show
    $('#passWord').togglePassword({
        el: '.hideShowPassword-toggle'
    })

    $('.hideShowPassword-toggle').click(function () {
        if ($(this).hasClass('hideShowPassword-toggle-hide')) {
            $(this).removeClass('hideShowPassword-toggle-hide')
        } else {
            $(this).addClass('hideShowPassword-toggle-hide')
        }
    })

    // // add account
    // $('.add-account').click(function() {
    //     $('.create-account').show()
    //     $('.dask').show()
    // })

    // search-hash
    $('#QueryContract').click(function () {
        $('#search-hash').show()
        $('.dask').show()
    })
    
    // $('#callContract').click(function () {
    //     $('#call-contract').show()
    //     $('.dask').show()
    //     $('.dask').click(function(){
    //       $('#call-contract').hide();
    //       $('#search-hash').hide();
    //       $('.dask').hide();
    //     })
    // })
    
    // ok  cancel
    $('.ok-search').click(function () {
        $('.search-hash').hide()
        $('.dask').hide()
    })

    // cancel account
    $('#cancel').click(function () {
        $('.create-account').hide()
        $('.search-hash').hide()
        $('.dask').hide()
        location.reload()
    })
    // click contract CONTRACT BYTE CODE
    $('.tab-code ul li').click(function () {
        let getPayload = $('#getPayload').text()
        $(this).addClass('cur').siblings().removeClass('cur')
        if ($(this)[0].id == 'contractByte') {
            $('#contractInput').val(getPayload)
        } else {
            // var str = 'pragma solidity ^0.5.0; \n contract validUintContractTest { \n    function test() public pure { \n    } \n }';
            // $('#contractInput').val($('#contractSourceCode').text())
            document.getElementById("contractInput").value = document.getElementById("contractSourceCode").innerText;

        }
    })
    //save contractInput content
    $('#contractInput').on('input',function(e){
        if($('.cur')[0].id == 'contractSource'){
            document.getElementById("contractSourceCode").innerText = this.value;
        }else if($('.cur')[0].id == 'contractByte'){
            document.getElementById("getPayload").innerText = this.value;
        }
    });


    $('.numbersOnly').keyup(function () {
        if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
           this.value = this.value.replace(/[^0-9\.]/g, '');
        }
    });

    jQuery.validator.addMethod("fixedPrecision", function(value, element,param) {
        return this.optional(element) || value.substring(value.indexOf(".")).length<=param;
      }, "Please specify the correct precision for your value");
})


function addKeyfilePopup(){
  console.log($('.addpopup').css("display"))
  // bring up display and give dask specific cleaning action listener
  if ( $('.addpopup').css("display") == "none" ) {
    $('.addpopup').show()
    $('.dask').show()
    $('.dask').click ( function () { clearAddKeyfile(); } )
    
    // add logic to text files:
    // loop: use class to significy choice
    //
    $('.prikey-add').focus ( function () {
        $('.add-choices').removeClass("add-type")
        $('.add-choices').val('')
        $('.prikey-add').addClass("add-type")
    })
    
    $('.shard-add').focus ( function () {
      $('.add-choices').removeClass("add-type")
      $('.add-choices').val('')
      $('.shard-add').addClass("add-type")
    })
  } else {
    clearAddKeyfile();
  }
}

function clearAddKeyfile(){
  $('.addpopup').hide()
  $('.dask').hide()
  $('.dask').off()

  $('.option-string').val('')
  $('.passwordfield-add').val('')
  refreshAccount()
}

function isDuplicateBy(value, field, arrayOfJsonObj) {
  if (arrayOfJsonObj.length==0){
    return false;
  }

  if ((field in arrayOfJsonObj[0])==false) {
    console.log("FIELD NOT EXIST")
  }

  for ( jsonObj of arrayOfJsonObj) {
      if (jsonObj[field] == value) {
        console.log(value, "is found in", jsonObj)
        return true
      }
  }
  return false
}

function shakeAddpopWithEr(msg){
  layer.msg(msg)
  $('.addpopup').addClass("smh")
  setTimeout(function(){ $('.addpopup').removeClass("smh"); }, 200);
}

function addKeyfile(){
  // if file name is full and valid
  // if password is full and valid
  // There must be a choice, defaulted
    // shard is valid
    // prikey is valid
    // btw its better that you give a default 1, and the add-type
  const fs = require('fs');

  var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
  const lang = document.getElementById("lang").value
  error = []

  var name = $('.file-add').val() // fam it can't be empty!
  if ( name == "" ) {
    error.push(json[lang]["createKeyfileWarning"]["stringEmpty"])
  } else {
    seeleClient.accountListPromise().then(a=>{
        if ( isDuplicateBy(name,"filename",a) ) {
          shakeAddpopWithEr(json[lang]["createKeyfileWarning"]["stringExist"])
          return;
        }
    }).catch(e=>{console.log(e);})
  }

  var pass = $('.passwordfield-add').val()
  // concat only returns a copy
  error = error.concat(passwordStrengthTest(pass));

  var prikey = $('.prikey-add').val()
  var shard = $('.shard-add').val()

  if (shard != "") {
    if( !/^[1-4]{1,1}$/.test( shard ) ){
      error.push(json[lang]["createKeyfileWarning"]["shardInvalid"])
    } else {
      var wallet = require("./src/js/wallet.js");
      gen = new wallet;
      // console.log(shard);
      const key = gen.createbyshard(shard)
      prikey = key.privatekey
      // console.log(key.publickey);
      
      
      // seeleClient.generateKey(shard).then((pair)=>{
      //   let prikey=pair.privatekey; 
      //   console.log(prikey);
      // 
      //   if ( error.length != 0 ) {
      //     console.log(error);
      //     layer.msg(error.join("\n"))
      //     $('.addpopup').addClass("smh")
      //     setTimeout(function(){ $('.addpopup').removeClass("smh"); }, 200);
      //   } else {
      //     console.log(name, prikey, pass);
      //     seeleClient.keyStore(name, prikey, pass).then(
      //       (res)=>{ clearAddKeyfile(); layer.msg(json[lang]["createKeyfileWarning"]["createSuccess"]); console.log("resolved");},
      //       (rej)=>{ console.log("rejected: why:");}
      //     )
      //   }
      //   setTimeout(function(){ refreshAccount(); }, 4000);
      //   return;
      // }).catch((e)=>{console.log(e);})
    }
  } else if ( prikey != "" ) {
    if( !/^0x[0-9a-z]{64,64}$/.test( prikey ) ){
      error.push(json[lang]["createKeyfileWarning"]["keyInvalid"])
    }
  }
  
  if ( error.length != 0 ) {
    console.log(error);
    layer.msg(error.join("\n"))
    $('.addpopup').addClass("smh")
    setTimeout(function(){ $('.addpopup').removeClass("smh"); }, 200);
  } else {
    // console.log(name, prikey, pass);
    seeleClient.keyStore(name, prikey, pass).then(
      (res)=>{ clearAddKeyfile(); layer.msg(json[lang]["createKeyfileWarning"]["createSuccess"]); console.log("resolved");},
      (rej)=>{ console.log("rejected: why:");}
    )
  }
  setTimeout(function(){ refreshAccount(); }, 4000);
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
  if (!/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(password)) { err.push(json[lang]["passwordWarning"]["specialChar"]) }
  var errmsg = []
  if (err.length != 0) {
    errmsg = [json[lang]["passwordWarning"]["fail"]].concat(err);
    // console.log(errmsg)
  }
  return errmsg
}

function addAccount() {
    $('.create-account').show()
    $('.dask').show()
}

function importAccounts(){
  const { dialog } = require('electron').remote

  const fs = require('fs')
  var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
  var settings = JSON.parse(fs.readFileSync(seeleClient.configpath), 'utf8')
  const lang = settings.lang;
  
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
    if ( seeleClient.keyfileisvalid(srcpath[item]) ) {
      var name = tempfilename[tempfilename.length-1];
      seeleClient.accountListPromise().then(a=>{
          if ( isDuplicateBy(name,"filename",a) ) {
            alert(json[lang]["createKeyfileWarning"]["stringExist"]);
          } else {
            fs.copyFileSync(srcpath[item], dstpath+name, (err) => {
              console.log(err);
              if (err) alert(err);
              //console.log('import sucess for ' + item + srcpath[item] + "to" + dstpath);
            }); 
            var refreshAccount = require('./src/js/getBalance.js');
            setTimeout(function(){ refreshAccount(); }, 1000);
            // refreshAccount();
          }
      }).catch(e=>{console.log(e);})
    } else {
      // console.log(seeleClient.keyfileisvalid(srcpath[item]));
      alert(json[lang]["importfail1"] +name+ json[lang]["importfail2"])
    }
  }
  
  // window.location.reload();
}

function exportAccounts() {
  //Get destination path
  const { dialog } = require('electron').remote
  const dstpath = dialog.showOpenDialog(
    { properties: ['openDirectory'],
      buttonLabel: 'Export To'}
  )

  //Get account file names and source paths
  const fs = require('fs')
  const srcpath = seeleClient.accountPath

  //create directory
  //var existingDirNames = fs.readdirSync(dstpath)
  //var dirname = 'account'
  //var i = 0
  //
  //while ( (dirname+i) in existingDirNames ) {i++}
  //dirname = dirname + i
  //
  //fs.mkdir(dstpath+'/'+dirname, err => {
  //  if (err && err.code != 'EEXIST') throw 'up'})

  //loop to copy
  seeleClient.accountList();
  for (var item in seeleClient.accountArray) {
    fs.copyFile(srcpath + seeleClient.accountArray[item], dstpath + '/' + seeleClient.accountArray[item], (err) => {
      if (err) throw err;
      console.log('export success for ' + seeleClient.accountArray[item]);
    });
  }
}

function ToAccountInfo(publickey, balance, shard) {
    var divhtml = ``
    divhtml += `<div id="accountlist" onload="resetGlobal()">`;
    divhtml += `<div class="accountFor">`;
    divhtml += `<span class="accountImg"><img src="./src/img/Headportrait.png"></span>`;
    divhtml += `<ul>`;
    divhtml += `<li class="lit" id="account">Account</li>`;
    divhtml += `<li><span>` + balance + `</span> SEELE</li>`;
    divhtml += `<li class="publickey">` + publickey + `</li>`;
    divhtml += `<li class="shard">` + "<span class=\"lit\" id=\"shard\">SHARD</span><span>-</span>" + shard + `</li>`;
    divhtml += `</ul>`;
    divhtml += `</div>`;
    divhtml += `</div>`;
    divhtml += `<div class="icon-list">`;
//     divhtml += `<dl onclick="changeMingingStatus('` + publickey + `')">`;
//     divhtml += `<dt><img src="./src/img/mine.png" heigth="50px", width="50px"></dt>`;
//     divhtml += `<dd id="isMining">Start Mining</dd>`;
//     divhtml += `</dl>`;
    divhtml += `<dl onclick="transfer('` + publickey + `')">`;
    divhtml += `<dt><img src="./src/img/Transfer.png"></dt>`;
    divhtml += `<dd class="lit" id="toTransfer">Transfer Seele & Tokens</dd>`;
    divhtml += `</dl>`;
    divhtml += `<dl style="cursor: pointer;" onclick="viewOnSeelescan('` + publickey + `')">`;
    divhtml += `<dt><a href="#"><img src="./src/img/ViewonSeelescan.png"></a></dt>`;
    divhtml += `<dd class="lit" id="toView">View On Seelescan</dd>`;
    divhtml += `</dl>`;
    divhtml += `<dl class="dl_copy" style="cursor: pointer;" onclick="copy()">`;
    divhtml += `<dt id="minePic"><img src="./src/img/copy.png"></dt>`;
    divhtml += `<dd class="lit" id="toCopy">Copy Address</dd>`;
    divhtml += `</dl>`;
    // divhtml += `<dl id="qr" class="qr_request" style="cursor: pointer;" onclick="showQR('` + publickey + `')">`;
    // divhtml += `<dt><img src="./src/img/ShowQRCode.png"></dt>`;
    // divhtml += `<dd class="lit" id="qr_request">Show QR Code</dd></br>`;
    // divhtml += `</dl>`;
    // divhtml += `<dl id="qr_result" class="qr_result" align="left">`
    // divhtml += `</dl>`
    divhtml += `</div>`;
    divhtml += `<h1 class="note lit" id="note">Note</h1>`;
    divhtml += `<p class="info lit" id="createInfo">Accounts are password protected keys that can hold seele. They can control contracts, but can't display incoming <span>transactions</span>.</p>`;
    // divhtml += `<h3 class="latest-title">Latest Transactions</h3>`

    // divhtml += `<div class="account-contact"><p class="contact-left">`
    // divhtml += `<span>Nov.</span><span>13</span>`
    // divhtml += `</p>`
    // divhtml += `<ul class="contact-right"><li>Created Contact</li>`
    // divhtml += `<li><span>0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1</span><span><a href="">https://seelescan.net/#/transaction/detail?txhash=0x4729740df31fa87ab73dcb537e2b6dcd6ac01735f936afd4ff08011747da5b00</a></span></li>`
    // divhtml += `</ul>`
    // divhtml += `</div>`
    //
    // divhtml += `<div class="account-contact"><p class="contact-left">`
    // divhtml += `<span>Nov.</span><span>13</span>`
    // divhtml += `</p>`
    // divhtml += `<ul class="contact-right"><li>Transfer Between Accounts</li>`
    // divhtml += `<li><span>0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1</span><span><a href="">https://seelescan.net/#/transaction/detail?txhash=0x4729740df31fa87ab73dcb537e2b6dcd6ac01735f936afd4ff08011747da5b00</a></span></li>`
    // divhtml += `</ul>`
    // divhtml += `</div>`

    // divhtml += `<div class="mine-config">`;
    // divhtml += `<span style="font-size:15px; font-family: sans-serif; text-align: center; "> Choose "IP:PORT"s from Seelescan </span>`;
    // divhtml += `<input type="image" src="./src/img/ViewonSeelescan.png" alt="Submit" width="18" height="18" style="cursor: pointer;" onclick="viewOnSeelescan('` + publickey + `')">`;
    // divhtml += `<input style="margin:18px; width: 80%; height: 20px; text-align: center; padding: 0,0,20,0;">`;
    // divhtml += `<input type="button" value="Cancel" id="mineConfigcancel" onclick="hidemineconfig()">`;
    // divhtml += `<input type="button" value="Mine" id="createKey">`;
    // divhtml += `</div>`;

    //divhtml += `<span class="publickey" style="display:none">` + publickey + `<span>`
    // divhtml += `<input id="cptg" style="display: none;" value="` + publickey + `" readonly/>`
    $('#tabs-1').html(divhtml)
    switchLanguage()
}

function showQR (publickey) {
    var result = document.getElementById("qr_result"); //mylink
    var request = document.getElementById("qr_request");//btnlink

    const fs = require('fs');
    var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
    const lang = document.getElementById("lang").value

    if(result.style.display !== 'flex') {
        var qrcode = new QRCode(document.getElementById("qr_result"), {
            width : 120,
            height : 120,
        });
        qrcode.makeCode(publickey);
        result.style.display = 'flex';
        const hide = json[lang]["hideQrCode"]
        request.innerText = hide;
    } else {
        result.style.display = 'none';
        const show = json[lang]["showQrCode"]
        request.innerText = show;
        result.innerHTML = "";
    }
}

function wallet(){
  $("#tab ul li:nth-child(1)").removeClass('tabli_active')
  $("#tab ul li:nth-child(1)").find('a').removeClass('tabulous_active')
  $("#tab ul li:nth-child(3)").removeClass('tabli_active')
  $("#tab ul li:nth-child(3)").find('a').removeClass('tabulous_active')

  $("#tab ul li:nth-child(1)").addClass('tabli_active')
  $("#tab ul li:nth-child(1)").find('a').addClass('tabulous_active')

  // $("#tabs_container").height(627)
  $("#tabs-2").addClass('make_transist')
  $("#tabs-2").addClass('hideleft')
  $("#tabs-2").removeClass('showleft')
  $("#tabs-3").addClass('make_transist')
  $("#tabs-3").addClass('hideleft')
  $("#tabs-3").removeClass('showleft')

  $("#tabs-1").addClass('hideleft')
  $("#tabs-1").addClass('make_transist')
  $("#tabs-1").addClass('showleft')
  
  $("#contractAccountpassWord").val('')
  $("#accountpassWord").val('')
}

function contract(account) {
    // var lis = $("#tab ul li")
    $("#tab ul li:nth-child(1)").removeClass('tabli_active')
    $("#tab ul li:nth-child(1)").find('a').removeClass('tabulous_active')
    $("#tab ul li:nth-child(2)").removeClass('tabli_active')
    $("#tab ul li:nth-child(2)").find('a').removeClass('tabulous_active')

    $("#tab ul li:nth-child(3)").addClass('tabli_active')
    $("#tab ul li:nth-child(3)").find('a').addClass('tabulous_active')

    // $("#tabs_container").height(627)
    $("#tabs-1").addClass('make_transist')
    $("#tabs-1").addClass('hideleft')
    $("#tabs-1").removeClass('showleft')

    $("#tabs-3").addClass('hideleft')
    $("#tabs-3").addClass('make_transist')
    $("#tabs-3").addClass('showleft')

    $("#contractPublicKey").val(account.pubkey)
    $("#ctAccount").val(JSON.stringify(account))
    // console.log(account);
}

function transaction(account) {
    //disable tab 1, 3
    $("#tab ul li:nth-child(1)").removeClass('tabli_active')
    $("#tab ul li:nth-child(1)").find('a').removeClass('tabulous_active')
    $("#tab ul li:nth-child(3)").removeClass('tabli_active')
    $("#tab ul li:nth-child(3)").find('a').removeClass('tabulous_active')
    //show tab 2
    $("#tab ul li:nth-child(2)").addClass('tabli_active')
    $("#tab ul li:nth-child(2)").find('a').addClass('tabulous_active')

    //hiding tab1
    $("#tabs_container").height(627)
    $("#tabs-1").addClass('make_transist')
    $("#tabs-1").addClass('hideleft')
    $("#tabs-1").removeClass('showleft')

    //showing tab2
    $("#tabs-2").addClass('hideleft')
    $("#tabs-2").addClass('make_transist')
    $("#tabs-2").addClass('showleft')

    //filling tab2
    $("#txPublicKey").val(account.pubkey)
    $("#txAccount").val(JSON.stringify(account))
}

function receipt( shard, word ) {
    document.getElementById("receiptShardword").innerText = word;
    document.getElementById("receiptShard").innerText = shard;
    console.log(document.getElementById("receiptShard").innerText);
    $('#search-hash').show()
    $('.dask').show()
    $('.dask').click(function(){clearReceipt();})
    // $('#searchImg').on('click',function(){queryContract();});
    // $('.okay-viewReceipt').on('click',function(){queryContract();console.log("clicked");});
}

function clearReceipt(){
  $('#search-hash').hide()
  $('.dask').hide()
  document.getElementById("receiptShard").innerText = "";
  document.getElementById("ctxHash").value = ""
  // console.log(document.getElementById("receiptShard").innerText);
  // console.log(document.getElementById("ctxHash").value);
  var contractHash = document.getElementById("receipt-contractHash")
  contractHash.innerText = "contract:" + ""

  var contractDeployFailedOrNo = document.getElementById("receipt-contractDeployFailedOrNo")
  contractDeployFailedOrNo.innerText = "failed:" + ""

  var contractPoststate = document.getElementById("receipt-contractPoststate")
  contractPoststate.innerText = "poststate:" + ""

  var contractResult = document.getElementById("receipt-contractResult")
  contractResult.innerText = "result:" + ""

  var contractTota1Fee = document.getElementById("receipt-contractTota1Fee")
  contractTota1Fee.innerText = "totalFee:" + ""

  var contractTxhash = document.getElementById("receipt-contractTxhash")
  contractTxhash.innerText = "txhash:" + ""

  var contractUsedGas = document.getElementById("receipt-contractUsedGas")
  contractUsedGas.innerText = "usedGas:" + ""
}

function call( shard, word ) {
  document.getElementById("callShardword").innerText = word;
  document.getElementById("callShard").innerText = shard 
  console.log(document.getElementById("callShard").innerText);
  $("#call-contract").show()
  $(".dask").show()
  $(".dask").click(function(){clearCall();})
  // $('#callImg').on('click',function(){callContract();});
  // 地址和字节码
  // 
  // document.getElementById("")
}

function clearCall(){
  $("#call-contract").hide()
  $(".dask").hide()
  // document.getElementById("contractAddress").value = ""
  // document.getElementById("contractPayload").value = ""
  document.getElementById("callShard").innerText = ""
  
  var contractDeployFailedOrNo = document.getElementById("call-contractDeployFailedOrNo")
  contractDeployFailedOrNo.innerText = "failed:" + ""

  var contractPoststate = document.getElementById("call-contractPoststate")
  contractPoststate.innerText = "poststate:" + ""

  var contractResult = document.getElementById("call-contractResult")
  contractResult.innerText = "result:" + ""

  var contractTota1Fee = document.getElementById("call-contractTota1Fee")
  contractTota1Fee.innerText = "totalFee:" + ""

  var contractTxhash = document.getElementById("call-contractTxhash")
  contractTxhash.innerText = "txhash:" + ""

  var contractUsedGas = document.getElementById("call-contractUsedGas")
  contractUsedGas.innerText = "usedGas:" + ""
}

function mineConfig(){
    // console.log("how")
    $('.mine-config').show()
    $('.minedask').show()
  }

function hidemineconfig(){
    $('.mine-config').hide()
    $('.minedask').hide()
  }

function copy() {
    var copyTextarea = document.querySelector('li.publickey');
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(copyTextarea);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');

    selection.removeAllRanges();
    const fs = require('fs');
    var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
    const lang = document.getElementById("lang").value
    const copyMsg=json[lang]["copySucess"]
    layer.msg(copyMsg)
}

function toclip(text) {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(text).then(
        function() {
        console.log("copied!")
        const fs = require('fs');
        var json = JSON.parse(fs.readFileSync(seeleClient.langPath.toString()).toString());
        const lang = document.getElementById("lang").value
        const copyMsg=json[lang]["copySucess"]
        layer.msg(copyMsg)
      }, function() {
        console.log("failed, but still permitted")
      });
    }
  });
}

function viewOnSeelescan(publickey) {
    require("electron").shell.openExternal("https://seelescan.net/#/account/detail?address=" + publickey);
}

function startMining(publickey) {
    seeleClient.startMine(publickey).then((data)=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    });
    document.getElementById("isMining").innerText="Stop Mining";
}

function stopMining2(shard) {
    seeleClient.StartNode(shard).then(data=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    });
    document.getElementById("isMining").innerText="Start Mining";
}

function stopMining(shard) {
    seeleClient.reStart(shard).then(data=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    });
    document.getElementById("isMining").innerText="Start Mining";
}

function changeMingingStatus(publickey) {
    var shard = seeleClient.getShardNum(publickey);
    var mineStatus = document.getElementById("isMining").innerText;
    if(mineStatus === "Start Mining") {
        this.startMining(publickey);
        this.stopMining2(shard);
        this.startMining(publickey);
        this.stopMining2(shard);
        this.startMining(publickey);
    } else if (mineStatus === "Stop Mining"){
        this.stopMining(shard);
        // this.startMining(publickey);
        // this.stopMining(shard);
        // this.startMining(publickey);
        // this.stopMining(shard);
    }
    // seeleClient.killNonminingNodeProcess(shard);
}

//@TODO use setItem/getItem to save mining status into localstorage, in order to get mining status after page refresh
function saveMineStatus (publickey) {

}

function toggleTooltip () {
  var list = document.getElementsByClassName("tooltiptext")
  for ( var item of list ) {
    if ( item.classList.contains("enable")) {
      item.classList.remove("enable")
    } else {
      item.classList.add("enable")
    }
  }
}
// module.exports = importAccounts;
