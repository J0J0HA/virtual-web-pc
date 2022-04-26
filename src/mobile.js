if (window.location.hash == "#mobile") {
  alert("mobile")
  var mobile_console_input = document.createElement('input');
  mobile_console_input.addEventListener('input', function() {
    cout.current_input = mobile_console_input.value;
    cout.update();
    this.focus();
  })
  document.body.appendChild(mobile_console_input);
  document.body.addEventListener("focus", function() {mobile_console_input.focus()})
  document.body.addEventListener("click", function() {mobile_console_input.focus()})
}
