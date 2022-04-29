const title = document.getElementsByTagName("title")[0];
const cout = new CustomConsole(document.getElementById("console-output"));
cout.input = true;
cout.max_output = 100;
cout.max_input = 100;
cout.first_line = "<br>VWPC-BIOS 0.0.8<br>";
cout.current_input = "help<!--SHINT--> [HINT: Press enter to run, or press Escape to ignore.]<!--EHINT-->"
cout.current_input_position = 4
cout.command_handler = function(fcmd) {
  if (!fcmd) return;
  cout.debug("Ran: " + fcmd)
  args = fcmd.split(" ")
  arg = fcmd.replace(args[0] + " ", "")
  cmd = args[0]
  argl = args.length - 1

  if (cmd == "help") {
    cout.write(
      "\n help (page 1 of 1):" +
      "\nl echo - Print empty line" +
      "\n echo <str> - Print <str>" +
      "\n js <native-code> - Run js-Code" +
      "\n jse <native-code> - Run js-Code and print result" +
      "\n set - Settings" +
      "\n help - Views this help page." +
      "\nl Running 'VWPC-BIOS' (0.0.8) by J0J0HA (GitHub) \n"
    );
  }
  else if (cmd == "echo") {
    if (argl == 0) {
      cout.write("");
    }
    else {
      cout.write(
        arg.replaceAll("\\nl", "\nl")
           .replaceAll("\\n", "\n")
      );
    }
  }
  else if (cmd == "js") {
    if (argl == 0) {
      cout.error("Invalid syntax.")
      cout.write(
        "\n js (page 1 of 1):" +
        "\nl js <native-code> - Run js-Code" +
        "\nl Running 'VWPC-BIOS' (0.0.8) by J0J0HA (GitHub) \n"
      );
    }
    else {
      eval(arg)
    }
  }
  else if (cmd == "jse") {
    if (argl == 0) {
      cout.error("Invalid syntax.")
      cout.write(
        "\n jse (page 1 of 1):" +
        "\nl jse <native-code> - Run js-Code and print result" +
        "\nl Running 'VWPC-BIOS' (0.0.8) by J0J0HA (GitHub) \n"
      );
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
  else if (cmd == "set") {
    if (argl == 0) {
      cout.error("Invalid syntax.");
      cout.write(
        "\n set (page 1 of 1):" +
        "\nl set logging <args> - Set log-types to print" +
        "\n set - Views this help page." +
        "\nl Running 'VWPC-BIOS' (0.0.8) by J0J0HA (GitHub) \n"
      );
    }
    else {
      if (args[1] == "logging") {
        if (args[2] == "out" || args[2] == "output" || args[2] == "write") {
          cout.log_write = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
        }
        else if (args[2] == "debug" || args[2] == "debugging") {
          cout.log_debug = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
        }
        else if (args[2] == "info" || args[2] == "infos" || args[2] == "information" || args[2] == "informations") {
          cout.log_info = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
        }
        else if (args[2] == "warn" || args[2] == "warning" || args[2] == "warnings") {
          cout.log_warn = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
        }
        else if (args[2] == "log" || args[2] == "logs") {
          cout.log_log = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
        }
        else if (args[2] == "error" || args[2] == "errors") {
          cout.log_error = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
        }
        else if (args[2] == "all") {
          cout.log_debug = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
          cout.log_log = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
          cout.log_info = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
          cout.log_warn = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
          cout.log_error = (["on", "enable", "enabled", "yes"].indexOf(args[3]) != -1);
        }
        else if (args[2] == "show") {
          cout.write(
            "\n set logging show (page 1 of 1):" +
            "\nl Write: " + cout.log_write +
            "\n Debug: " + cout.log_debug +
            "\n Log: " + cout.log_log +
            "\n Info: " + cout.log_info +
            "\n Warn: " + cout.log_warn +
            "\n Error: " + cout.log_error +
            "\nl Running 'VWPC-BIOS' (0.0.8) by J0J0HA (GitHub) \n"
          )
        }
        else {
          cout.error("Invalid syntax.")
          cout.write(
            "\n set logging (page 1 of 1):" +
            "\nl set logging show - Show current settings" +
            "\n set logging <out|output|write> [<on|enable|enabled|yes|off|disable|disabled|no>] - Allows write-messages to print" +
            "\n set logging all [<on|enable|enabled|yes|off|disable|disabled|no>] - Allows all non-write-messages to print" +
            "\n set logging <debug|debugging> [<on|enable|enabled|yes|off|disable|disabled|no>] - Allows debug-messages to print" +
            "\n set logging <log|logs> [<on|enable|enabled|yes|off|disable|disabled|no>] - Allows log-messages to print" +
            "\n set logging <info|infos|inforamtion|informations> [<on|enable|enabled|yes|off|disable|disabled|no>] - Allows info-messages to print" +
            "\n set logging <warn|warnin|warnings> [<on|enable|enabled|yes|off|disable|disabled|no>] - Allows warn-messages to print" +
            "\n set logging <error|errors> [<on|enable|enabled|yes|off|disable|disabled|no>] - Allows error-messages to print" +
            "\n set logging - Views this help page." +
            "\nl Running 'VWPC-BIOS' (0.0.8) by J0J0HA (GitHub) \n"
          );
        }
      }
    }
  }
  else {
      cout.error("Unknown command: '" + cmd + "'")
  }
}

cout.focus();

if (window.location.hash == "#mobile") {
  alert("Using mobile 0.0.7")
  var mobile_console_input = document.createElement('input');
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

title.innerHTML = "VWPC - BIOS 0.0.8"
