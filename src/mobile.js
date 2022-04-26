if (window.location.hash == "#mobile") {
  alert("mobile")
  var mobile_console_input = document.createElement('input');
  // mobile_console_input.style.display = "none";
  mobile_console_input.addEventListener("onkeydown", function(){
    this.value = "";
    cout.log(event.keyCode)
  })
  document.body.prepend(mobile_console_input);
  mobile_console_input.focus();
  mobile_console_input.click();
  document.body.addEventListener("focus", function() {mobile_console_input.focus(); mobile_console_input.click()})
  document.body.addEventListener("click", function() {mobile_console_input.focus(); mobile_console_input.click()})
}
