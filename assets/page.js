$(document).ready(function(){

  var checkLastInputValue   = "";
  var checkLastUnicodeValue = "";
  var duringComposition     = false;
  var intervalId = false;
  var format     = "number";
  var type       = "";
  var padding    = false;

  var elemUnicodeInput = $("#unicode-input");
  var elemUnicodeValue = $("#unicode-value");

  var NumberHexChanger = function(value) {
    switch (typeof value) {
      case "string" : return parseInt(value, 16);
      case "number" : return toPad((value).toString(16));
    }
    return undefiend;
  }
  var toPad = function(value) {
    return (padding) ? ("000"+value).slice(-4) : value;
  }

  $('input[name=format]').change(function() {
    var _format = this.value;
    var value   = elemUnicodeValue.val();
    var pass    = (value) ? false : true; 
    value = (format == "number") ? parseInt(value) : value;
    if (_format == "hex") {
      format = "hex";
      $("#pad").attr("disabled", false);
    } else {
      format = "number"; 
      $("#pad").attr("disabled", true);
    }
    if (pass) return true;
    checkLastUnicodeValue = NumberHexChanger(value);
    return elemUnicodeValue.val(checkLastUnicodeValue);
  });

  
  $('#pad').change(function(){
    padding = ($(this).is(":checked")) ? true : false;
    var value = elemUnicodeValue.val();
    if (!value) return false;
    if (padding) {
      checkLastUnicodeValue = toPad(value);
    } else {
      value = parseInt(value, 16);
      checkLastUnicodeValue = NumberHexChanger(value);
    }
    elemUnicodeValue.val(checkLastUnicodeValue);
    return checkLastUnicodeValue;
  });

  //
  // CHECK INPUT ELEMENTS TO GET VALUE
  // using interval function for some language's composition on firefox  
  //
    
  var charToUnicode = function() {
    var value = elemUnicodeInput.val() || '';
    if (checkLastInputValue == value) return false;
    checkLastInputValue = value;
    if (!value) return elemUnicodeValue.val("");
    checkLastUnicodeValue = value.charCodeAt(0);
    if (format == "hex") {
      checkLastUnicodeValue = NumberHexChanger(checkLastUnicodeValue);
    }
    elemUnicodeValue.val(checkLastUnicodeValue);
  };

  elemUnicodeInput.focus(function() {
    if (intervalId) return false;
    intervalId = setInterval(charToUnicode, 200); 
  });

  elemUnicodeInput.blur(function() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = false;
      var value = elemUnicodeInput.val();
      if (!value) return true;
      value = value.charAt(value.length - 1);
      elemUnicodeInput.val(value);
    }
  }); //this.select();

  elemUnicodeInput.keypress(function(){
    if (duringComposition) return true;
    var value = elemUnicodeInput.val();
    if (value)  {
      elemUnicodeInput.val('');
    }
  });

  /*
  elemUnicodeInput.on('compositionupdate', function(){
    console.log("update", e.originalEvent);
    elemUnicodeInput.get(0).select();
  });*/

  elemUnicodeInput.on('compositionstart', function(){
    duringComposition = true;
    elemUnicodeInput.val(''); 
  });

  elemUnicodeInput.on('compositionend', function(){
    duringComposition = false;
    //elemUnicodeInput.val(''); // CLEAR FOR ONLY ONE LETTER
  });

  $("#toChar").click(function() {
    var value = elemUnicodeValue.val();
    var result;
    if (!value || checkLastUnicodeValue == value) return false;
    if (format == "hex") result = NumberHexChanger(value);
    else result = parseInt(value);
    result = String.fromCharCode(result);
    checkLastInputValue   = result;
    checkLastUnicodeValue = value;
    elemUnicodeInput.val(result);
  });

  // IN CASE, INIT ENVIORMENT VALUE (REFRESH ON FIREFOX);
  padding = ($("#pad").is(":checked")) ? true : false;
  format  = $('input[name=format]').value;

});