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
            var str = 'pragma solidity ^0.5.0; \n contract validUintContractTest { \n    function test() public pure { \n    } \n }';
            $('#contractInput').val(str)
        }
    })
})

function addAccount() {
    $('.create-account').show()
    $('.dask').show()
}


function ToAccountInfo(publickey, balance) {
    var divhtml = ""
    divhtml += `<div id="accountlist" onload="resetGlobal()">`;
    divhtml += `<div class="accountFor">`;
    divhtml += `<span class="accountImg"><img src="./src/img/Headportrait.png"></span>`;
    divhtml += `<ul>`;
    divhtml += `<li>Account</li>`;
    divhtml += `<li class="publickey">` + publickey + `</li>`;
    divhtml += `<li><span>` + balance + `</span> Seele</li>`;
    divhtml += `</ul>`;
    divhtml += `</div>`;
    divhtml += `</div>`;
    divhtml += `<div class="icon-list">`;
    divhtml += `<dl onclick="transfer('` + publickey + `')">`;
    divhtml += `<dt><img src="./src/img/Transfer.png"></dt>`;
    divhtml += `<dd>Transfer Seele & Tokens</dd>`;
    divhtml += `</dl>`;
    divhtml += `<dl>`;
    divhtml += `<dt><a href="#"><img src="./src/img/ViewonSeelescan.png"></a></dt>`;
    divhtml += `<dd>View On Seelescan</dd>`;
    divhtml += `</dl>`;
    divhtml += `<dl class="dl_copy" style="cursor: pointer;" onclick="copy()">`;
    divhtml += `<dt><img src="./src/img/copy.png"></dt>`;
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
    divhtml += `<h3 class="latest-title">Latest Transactions</h3>`

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