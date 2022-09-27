const title = document.getElementsByTagName("title")[0];
title.innerHTML = static.bios.name.full;

var filestore = new FileStorage("fs:root");

const cout = new CustomConsole(document.getElementById("console-output"));
cout.input = true;
cout.max_output = 250;
cout.first_line = "<br>" + static.bios.name.full + "<br>";
cout.type_input("help")
cout.command_handler = function(fcmd) {
  if (!fcmd) return;
  cout.debug("Ran: " + fcmd)
  console.debug("BIOS command handler recived: " + fcmd)
  args = fcmd.split(" ")
  arg = fcmd.replace(args[0] + " ", "")
  cmd = args[0]
  argl = args.length - 1

  if (cmd == "help") {
    cout.write(
      "clear      -> delete all output\n" +
      "js <code>  -> run <code> with javascript and echo output"
    );
  }
  else if (cmd == "js") {
    if (argl == 0) {
      cout.error("Invalid syntax.");
    }
    else {
      try {
        cout.write(eval(arg));
      }
      catch (err) {
        cout.error(err.name + ': ' + err.message);
      }
    }
  }
  else if (cmd == "clear") {
    cout.output = [];
  }
  else {
      cout.error("Unknown command: '" + cmd + "'")
  }
}

cout.focus();

if (window.location.hash == "#mobile") {
  alert("Using mobile version! (BETA)")
  var mobile_console_input = document.createElement('input');
  mobile_console_input.value = ":"
  mobile_console_input.addEventListener("input", function(){
    if (this.value.startsWith(":")) {
      this.value = this.value.replace(":", "")
      cout.current_input += this.value;
    }
    else {
      cout.current_input = cout.current_input.substring(0, cout.current_input.length - 1)
    }
    cout.current_input_position = cout.current_input.length;
    cout.update()
    this.value = ":";
  })
  document.body.prepend(mobile_console_input);
  mobile_console_input.focus();
  mobile_console_input.click();
  document.body.addEventListener("focus", function() {mobile_console_input.focus(); mobile_console_input.click()})
  document.body.addEventListener("click", function() {mobile_console_input.focus(); mobile_console_input.click()})
}
