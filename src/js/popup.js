var refreshAccount = require('./src/js/getBalance.js')
var SeeleClient = require('./src/api/seeleClient');
seeleClient = new SeeleClient();

function moreAbout(account){
    // console.log(account);
    //place your filename, shard and publickey on the top
    //which you can then use to 
    $('.more-filename').html(account.filename)
    $('.more-shard').html("片: " + account.shard)
    $('.more-publickey').html(account.pubkey)
    
    $('.popuplocationwrap').show()  
    $('.dask').show()
}

function clearpopup() {
  // hide
  $('.popuplocationwrap').hide()
  $('.dask').hide()
  // clear fields
  $('.passwordfield').val('')
  $('.more-filename').val('')
  $('.more-shard').val('')
  $('.more-publickey').val('')
  // disable options
  $('.option').removeClass("enabledOption")
  $('.option').addClass("disabledOption")
  $('.option').off()
  // update account if move happened
  refreshAccount()
}

function unlockmore() {
    var pass = $('.passwordfield').val()
    $('.passwordfield').val('')
    var file = $('.more-filename').html()
    var key = fs.readFileSync(seeleClient.accountPath+file).toString()
    seeleClient.decKeyFile(file,pass).then( 
      function(result){
        layer.msg("unlock success!")
        $('.option').removeClass("disabledOption")
        $('.option').addClass("enabledOption")
        $('.prikey').html(result)
        $('.copy-pub').click( function(){ toclip($('.more-publickey').html()); } )
        $('.copy-pri').click( function(){ toclip(result); } )
        $('.copy-key').click( function(){ toclip(key); } )
        $('.move-key').click( function(){ moveKeyfileTo(file); } )
      }, 
      function(error){
        $('.popuplocationwrap').addClass("smh")
        setTimeout(function(){ $('.popuplocationwrap').removeClass("smh"); }, 200);
      })
}

function moveKeyfileTo( file ) {
    var { dialog } = require('electron').remote
    // var fsPromises = require('fs').promises
    var dstpath = dialog.showOpenDialog(
      { properties: ['openDirectory'],
        buttonLabel: 'Export To'})
    var srcpath = seeleClient.accountPath;
    var success = false
    try {
      fs.copyFileSync(srcpath+file, dstpath+'/'+file, fs.constants.COPYFILE_EXCL);
      try {
        fs.unlinkSync(srcpath+file)
        success = true;
      } catch (e) {
        console.log(e)
      }
    } catch (e) {
      console.log(e);
    }
    if(success){ layer.msg('move success') } else { layer.msg('move failed') }
    setTimeout(function(){}, 500);
}


