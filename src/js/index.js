/*
author: Miya_yang
date:2018.10.30
*/
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
    $('.Query').click(function () {
        $('.search-hash').show()
        $('.dask').show()
    })
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
    })
    // click contract CONTRACT BYTE CODE
    $('.tab-code ul li').click(function () {
        let getPayload = $('#getPayload').text()
        $(this).addClass('cur').siblings().removeClass('cur')
        if ($(this).text() == 'CONTRACT BYTE CODE') {
            $('#contractInput').val(getPayload)
        } else {
            // var str = 'pragma solidity ^0.5.0; \n contract validUintContractTest { \n    function test() public pure { \n    } \n }';
            // $('#contractInput').val($('#contractSourceCode').text())
            document.getElementById("contractInput").value = document.getElementById("contractSourceCode").innerText;

        }
    })
    //save contractInput content
    $('#contractInput').on('input',function(e){
        if($('.cur').text() == 'SOLIDITY CONTRACT SOURCE CODE'){
            document.getElementById("contractSourceCode").innerText = this.value;
        }else if($('.cur').text() == 'CONTRACT BYTE CODE'){
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

function addAccount() {
    $('.create-account').show()
    $('.dask').show()
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
  window.location.reload();
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
    var divhtml = ""
    divhtml += `<div id="accountlist" onload="resetGlobal()">`;
    divhtml += `<div class="accountFor">`;
    divhtml += `<span class="accountImg"><img src="./src/img/Headportrait.png"></span>`;
    divhtml += `<ul>`;
    divhtml += `<li>Account</li>`;
    divhtml += `<li><span>` + balance + `</span> Seele</li>`;
    divhtml += `<li class="publickey">` + publickey + `</li>`;
    divhtml += `<li class="shard">` + "shard-" + shard + `</li>`;
    divhtml += `</ul>`;
    divhtml += `</div>`;
    divhtml += `</div>`;
    divhtml += `<div class="icon-list">`;
    // divhtml += `<dl onclick="changeMingingStatus('` + publickey + `')">`;
    // divhtml += `<dt><img src="./src/img/mine.png" heigth="50px", width="50px"></dt>`;
    // divhtml += `<dd id="isMining">Start Mining</dd>`;
    // divhtml += `</dl>`;
    divhtml += `<dl onclick="transfer('` + publickey + `')">`;
    divhtml += `<dt><img src="./src/img/Transfer.png"></dt>`;
    divhtml += `<dd>Transfer Seele & Tokens</dd>`;
    divhtml += `</dl>`;
    divhtml += `<dl style="cursor: pointer;" onclick="viewOnSeelescan('` + publickey + `')">`;
    divhtml += `<dt><a href="#"><img src="./src/img/ViewonSeelescan.png"></a></dt>`;
    divhtml += `<dd>View On Seelescan</dd>`;
    divhtml += `</dl>`;
    divhtml += `<dl class="dl_copy" style="cursor: pointer;" onclick="copy()">`;
    divhtml += `<dt id="minePic"><img src="./src/img/copy.png"></dt>`;
    divhtml += `<dd>Copy Address</dd>`;
    divhtml += `</dl>`;
    divhtml += `<dl id="qr" class="qr_request" style="cursor: pointer;" onclick="showQR('` + publickey + `')">`;
    divhtml += `<dt><img src="./src/img/ShowQRCode.png"></dt>`;
    divhtml += `<dd id="qr_request">Show QR Code</dd></br>`;
    divhtml += `</dl>`;
    divhtml += `<dl id="qr_result" class="qr_result" align="left">`
    divhtml += `</dl>`
    divhtml += `</div>`;
    divhtml += `<h1 class="note">Note</h1>`;
    divhtml += `<p class="info">Accounts are password protected keys that can hold seele. They can control contracts, but can't display incoming <span>transactions</span>.</p>`;
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


    //divhtml += `<span class="publickey" style="display:none">` + publickey + `<span>`
    // divhtml += `<input id="cptg" style="display: none;" value="` + publickey + `" readonly/>`
    $('#tabs-1').html(divhtml)
}

function showQR (publickey) {
    var result = document.getElementById("qr_result"); //mylink
    var request = document.getElementById("qr_request");//btnlink

    if(result.style.display !== 'flex') {
        var qrcode = new QRCode(document.getElementById("qr_result"), {
            width : 120,
            height : 120,
        });
        qrcode.makeCode(publickey);
        result.style.display = 'flex';
        request.innerText = "Hide QR Code";
    } else {
        result.style.display = 'none';
        request.innerText = "Show QR Code";
        result.innerHTML = "";
    }
}

function transfer(publickey) {
    var lis = $("#tab ul li")
    lis.each(function (i) {
        if ($(this).hasClass('tabli_active')) {
            $(this).removeClass('tabli_active')
            $(this).find('a').removeClass('tabulous_active')
        } else {
            $(this).addClass('tabli_active')
            $(this).find('a').addClass('tabulous_active')
        }
    })

    $("#tabs_container").height(627)
    $("#tabs-1").addClass('make_transist')
    $("#tabs-1").addClass('hideleft')
    $("#tabs-1").removeClass('showleft')

    $("#tabs-2").addClass('hideleft')
    $("#tabs-2").addClass('make_transist')
    $("#tabs-2").addClass('showleft')

    $("#txpublicKey").val(publickey)
    $("#contractPublicKey").val(publickey)
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
    layer.msg("copy success")
}

function viewOnSeelescan(publickey) {
    require("electron").shell.openExternal("https://seelescan.net/#/account/detail?address=" + publickey);
}

function startMining(publickey) {

    seeleClient.startMine(publickey);
    document.getElementById("isMining").innerText="Stop Mining";
}

function stopMining(shard) {
    seeleClient.StartNode(shard);
    document.getElementById("isMining").innerText="Start Mining";
}

function changeMingingStatus(publickey) {
    var shard = seeleClient.getShardNum(publickey)
    var mineStatus = document.getElementById("isMining").innerText;
    if(mineStatus === "Start Mining") {
        this.startMining(publickey);
    } else if (mineStatus === "Stop Mining"){
        this.stopMining(shard);
    }
    // seeleClient.killNonminingNodeProcess(shard);
}