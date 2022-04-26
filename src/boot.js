const title = document.getElementsByTagName("title")[0];
const cout = new CustomConsole(document.getElementById("console-output"), true);
cout.command_handler = function(cmd) {
  cout.write("Recived: '" + cmd + "'")
}
cout.focus();

if (window.location.hash == "#mobile") {
  alert("mobile")
  var mobile_console_input = document.createElement('input');
  // mobile_console_input.style.display = "none";
  cout.unfocus();
  mobile_console_input.addEventListener("input", function(){
    cout.current_input += this.value;
    cout.update()
    this.value = "";
  })
  document.body.prepend(mobile_console_input);
  mobile_console_input.focus();
  mobile_console_input.click();
  document.body.addEventListener("focus", function() {mobile_console_input.focus(); mobile_console_input.click()})
  document.body.addEventListener("click", function() {mobile_console_input.focus(); mobile_console_input.click()})
}
