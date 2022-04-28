class CustomConsole {
  elem = undefined;
  input = true;
  output = [];
  listener_id = undefined;
  current_input = "";
  max_output = Infinity;
  max_input = Infinity;
  command_handler = undefined;
  log_write = true;
  log_debug = false;
  log_log = true;
  log_info = true;
  log_warn = true;
  log_error = true;

  constructor(elem) {
    this.elem = elem;
    this.update();
  }

  focus() {
    this.listener_id = listeners.listen("keydown", this.handler, [this])
  }

  unfocus() {
    listeners.unlisten(this.listener_id)
  }

  handler(self) {
    if (self.current_input.endsWith("<!--EHINT-->")) {
      while (!self.current_input.endsWith("<!--SHINT-->")) {
        self.current_input = self.current_input.substring(0, self.current_input.length - 1);
      }
      self.current_input = self.current_input.substring(0, self.current_input.length - 12);
    }
    if (event.key == "Enter") {
      var decoded = self.current_input
        .replaceAll("<!--SREM-->&nbsp;<!--EREM-->", " ")
        .replaceAll("<!--SREM-->&nbsp;&nbsp;&nbsp;&nbsp;<!--EREM-->", "    ")
        .replaceAll(/<!--SREM-->&#[0-9]+;<!--EREM-->/g, function(i) {
          return String.fromCharCode(
            parseInt(
              i.replaceAll(/<!--SREM-->&#/g, "")
               .replaceAll(/;<!--EREM-->/g, "")
             )
           )
      })
      self.output.push("> " + self.current_input);
      if (self.command_handler) {
        self.command_handler(decoded);
      } else {
        self.error("No command handler defined! Command ignored.");
      }
      self.current_input = "";
    }
    else if (event.key == "Escape") {
      self.current_input = "";
    }
    else if (event.key == "Insert") {
      return self.warn("Insert not yet supported");
    }
    else if (event.key == "Delete") {
      return self.warn("Delete not yet supported");
    }
    else if (event.key == "ArrowUp") {
      return self.warn("Arrows not yet supported");
    }
    else if (event.key == "ArrowDown") {
      return self.warn("Arrows not yet supported");
    }
    else if (event.key == "ArrowLeft") {
      return self.warn("Arrows not yet supported");
    }
    else if (event.key == "ArrowRight") {
      return self.warn("Arrows not yet supported");
    }
    else if (event.key == "PageUp") {
      return self.elem.scrollBy(0, -self.elem.clientHeight)
    }
    else if (event.key == "PageDown") {
      return self.elem.scrollBy(0, self.elem.clientHeight)
    }
    else if (event.key == "Home") {
      return self.elem.scrollTo(0, 0)
    }
    else if (event.key == "End") {
      return self.elem.children[self.elem.children.length - 1].scrollIntoView();
    }
    else if (["Shift", "Meta", "OS", "Control", "Alt", "AltGraph", "ContextMenu", "CapsLock", "ScrollLock", "NumLock"].indexOf(event.key) != -1) {
      self.debug("Key ignored. No Typeable Key.")
    }
    else if (event.key == "Unrecognized") {
      self.warn("Unknown key: " + event.keyCode)
    }
    else if (["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].indexOf(event.key) != -1) {
      self.warn("F-Buttons not yet supported");
    }
    else if (event.key == "Backspace") {
      if (self.current_input.endsWith("<!--EREM-->")) {
        while (!self.current_input.endsWith("<!--SREM-->")) {
          self.current_input = self.current_input.substring(0, self.current_input.length - 1);
        }
        self.current_input = self.current_input.substring(0, self.current_input.length - 11);
      }
      else {
        self.current_input = self.current_input.substring(0, self.current_input.length - 1);
      }
    }

    // KEYS THAT WRITE

    else if (self.current_input.replaceAll(/<!--SREM-->.*<!--EREM-->/g, ".").length >= self.max_input) {
         return;
    }
    else if (event.key == "Dead" && event.keyCode == 220) {
      self.current_input += "^";
    }
    else if (event.key == "Dead" && (event.keyCode != 160 && event.keyCode != 192)) {
      self.warn("Unknown Dead, thanks to your browser. (Use Firefox)")
    }
    else if (event.key == "^^") {
      self.current_input += "^";
    }
    else if (event.key == "´´") {
      self.current_input += "´";
    }
    else if (event.key == "``") {
      self.current_input += "`";
    }
    else if (event.keyCode == 160 || event.keyCode == 192) {
      self.current_input += "<!--SHINT--> Type the letter to assing or press again: <!--EHINT-->";
    }
    else if (event.key == "Tab") {
      self.current_input += "<!--SREM-->&nbsp;&nbsp;&nbsp;&nbsp;<!--EREM-->";
    }
    else if (event.key == " ") {
      self.current_input += "<!--SREM-->&nbsp;<!--EREM-->";
    }
    else if (event.key.length != 1) {
      self.warn("Ignored special key: " + event.key);
    }
    else {
      var encoded = event.key.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '<!--SREM-->&#'+i.charCodeAt(0)+';<!--EREM-->';
      });
      self.current_input += encoded;
    }
    self.update();
  }

  to_html() {
    var html_output = "<br>VWPC-BIOS 0.0.6<br>";
    var input_html = "";
    if (this.input) {
      input_html = '<div class="console-input">> <span id="input">' + this.current_input + '</span><span class="cursor blink">|</span></div>'
    }
    for (var line of this.output) {
      var color = "o"
      if (line.startsWith("[LOG]")) {
        color = "l"
      }
      if (line.startsWith("[DEBUG]")) {
        color = "d"
      }
      if (line.startsWith("[INFO]")) {
        color = "i"
      }
      else if (line.startsWith("[WARN]")) {
        color = "w"
      }
      else if (line.startsWith("[ERROR]")) {
        color = "e"
      }
      if ((color == "o" && !this.log_write) || (color == "e" && !this.log_error) || (color == "i" && !this.log_info) || (color == "l" && !this.log_log) || (color == "w" && !this.log_warn) || (color == "d" && !this.log_debug)) {
        // Skip line
      }
      else {
        html_output += "<span class='console-line-" + color + "'>" + line + "</span><br>"
      }
    }
    return html_output + input_html + "<span class='stay-focused'></span>";
  }

  update() {
    while (this.output.length > this.max_output) {
      this.output.shift();
    }
    this.elem.innerHTML = this.to_html()
    this.elem.children[this.elem.children.length - 1].scrollIntoView()
  }

  debug(msg) {
    this.write("[DEBUG] " + str(msg));
  };

  info(msg) {
    this.write("[INFO] " + str(msg));
  };

  write(msg) {
    var encoded = str(msg).replace(/[\u00A0-\u9999<>\&]/g, function(i) {
      return '&#'+i.charCodeAt(0)+';';
    })
      .replaceAll("\nl ", "<hr>")
      .replaceAll("\n ", "<br>")
      .replaceAll("\nl", "<hr>")
      .replaceAll("\n", "<br>")
      .replaceAll(" ", "&nbsp;")
    this.output.push(encoded);
    this.update();
  };

  log(msg) {
    this.write("[LOG] " + str(msg));
  };

  warn(msg) {
    this.write("[WARN] " + str(msg));
  };

  error(msg) {
    this.write("[ERROR] " + str(msg));
  };
}
