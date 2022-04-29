class CustomConsole {
  elem = undefined;
  input = true;
  output = [];
  listener_id = undefined;
  current_input = "";
  current_history_position = 0;
  current_input_position = 0;
  history = [];
  first_line = "<br>";
  max_output = Infinity;
  max_input = Infinity;
  command_handler = undefined;
  log_write = true;
  log_debug = false;
  log_log = true;
  log_info = true;
  log_warn = true;
  log_error = true;
  cursor_blink = "";

  constructor(elem) {
    this.elem = elem;
  }

  focus() {
    this.listener_id = listeners.listen("keydown", this.handler, [this]);
    this.cursor_blink = "blink";
    this.update();
  }

  unfocus() {
    listeners.unlisten("keydown", this.listener_id);
    this.cursor_blink = "";
    this.update();
  }

  handler(self) {
    self.current_input = self.current_input.replaceAll(/<!--SHINT-->.*<!--EHINT-->/g, "")
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
      self.history.unshift(self.current_input);
      if (self.command_handler) {
        self.command_handler(decoded);
      } else {
        self.error("No command handler defined! Command ignored.");
      }
      self.current_input = "";
      self.current_input_position = 0;
      self.current_history_position = -1;
    }
    else if (event.key == "Escape") {
      self.current_input = "";
    }
    else if (event.key == "Insert") {
      return self.warn("Insert not yet supported");
    }
    else if (event.key == "ArrowUp") {
      self.current_history_position ++;
      if (self.current_history_position > self.history.length - 1) self.current_history_position = self.history.length - 1;
      self.current_input = self.history[self.current_history_position];
      self.current_input_position = self.current_input.length;
    }
    else if (event.key == "ArrowDown") {
      self.current_history_position --;
      if (self.current_history_position < -1) self.current_history_position = -1;
      self.current_input = self.history[self.current_history_position] || "";
      self.current_input_position = self.current_input.length;
    }
    else if (event.key == "ArrowLeft") {
      if (self.current_input.substring(0, self.current_input_position).endsWith("<!--EREM-->")) {
        while (!self.current_input.substring(0, self.current_input_position).endsWith("<!--SREM-->")) {
          self.current_input_position --;
        }
        self.current_input_position -= 11;
      }
      else {
        self.current_input_position --;
      }
      if (self.current_input_position > self.current_input.length) self.current_input_position = self.current_input.length;
    }
    else if (event.key == "ArrowRight") {
      if (self.current_input.substring(self.current_input_position, self.current_input.length).startsWith("<!--SREM-->")) {
        while (!self.current_input.substring(self.current_input_position, self.current_input.length).startsWith("<!--EREM-->")) {
          self.current_input_position ++;
        }
        self.current_input_position += 11;
      }
      else {
        self.current_input_position ++;
      }
      if (self.current_input_position < 0) self.current_input_position = 0;
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
      if (self.current_input.substring(0, self.current_input_position).endsWith("<!--EREM-->")) {
        while (!self.current_input.substring(0, self.current_input_position).endsWith("<!--SREM-->")) {
          self.current_input = self.current_input.substring(0, self.current_input_position - 1) + self.current_input.substring(self.current_input_position, self.current_input.length);
          self.current_input_position --;
        }
        self.current_input = self.current_input.substring(0, self.current_input_position - 11) + self.current_input.substring(self.current_input_position, self.current_input.length);
        self.current_input_position -= 11;
      }
      else {
        self.current_input = self.current_input.substring(0, self.current_input_position - 1) + self.current_input.substring(self.current_input_position, self.current_input.length);
        self.current_input_position --;
      }
    }
    else if (event.key == "Delete") {
      if (self.current_input.substring(self.current_input_position, self.current_input.length).startsWith("<!--SREM-->")) {
        while (!self.current_input.substring(self.current_input_position, self.current_input.length).startsWith("<!--EREM-->")) {
          self.current_input = self.current_input.substring(0, self.current_input_position) + self.current_input.substring(self.current_input_position + 1, self.current_input.length);
        }
        self.current_input = self.current_input.substring(0, self.current_input_position) + self.current_input.substring(self.current_input_position + 11, self.current_input.length);
      }
      else {
        self.current_input = self.current_input.substring(0, self.current_input_position) + self.current_input.substring(self.current_input_position + 1, self.current_input.length);
      }
    }

    // KEYS THAT WRITE

    else if (self.current_input.replaceAll(/<!--SREM-->.*<!--EREM-->/g, ".").length >= self.max_input) {
         return;
    }
    else if (event.key == "Dead" && event.keyCode == 220) {
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        "^" +
        self.current_input.substring(self.current_input_position, self.current_input.length)
      self.current_input_position ++;
    }
    else if (event.key == "Dead" && (event.keyCode != 160 && event.keyCode != 192)) {
      self.error("Unknown Dead, thanks to your browser. (Use Firefox)")
    }
    else if (event.key == "^^") {
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        "^" +
        self.current_input.substring(self.current_input_position, self.current_input.length)
      self.current_input_position ++;
    }
    else if (event.key == "´´") {
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        "´" +
        self.current_input.substring(self.current_input_position, self.current_input.length)
      self.current_input_position ++;
    }
    else if (event.key == "``") {
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        "`" +
        self.current_input.substring(self.current_input_position, self.current_input.length)
      self.current_input_position ++;
    }
    else if (event.keyCode == 160 || event.keyCode == 192) {
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        "<!--SHINT--> Type the letter to assign or press again: <!--EHINT-->" +
        self.current_input.substring(self.current_input_position, self.current_input.length)
    }
    else if (event.key == "Tab") {
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        "<!--SREM-->&nbsp;&nbsp;&nbsp;&nbsp;<!--EREM-->" +
        self.current_input.substring(self.current_input_position, self.current_input.length)
      self.current_input_position += 46;
    }
    else if (event.key == " ") {
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        "<!--SREM-->&nbsp;<!--EREM-->" +
        self.current_input.substring(self.current_input_position, self.current_input.length)
      self.current_input_position += 28;
    }
    else if (event.key.length != 1) {
      self.warn("Ignored special key: " + event.key);
    }
    else {
      var encoded = event.key.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '<!--SREM-->&#'+i.charCodeAt(0)+';<!--EREM-->';
      });
      self.current_input = self.current_input.substring(0, self.current_input_position) +
        encoded +
        self.current_input.substring(self.current_input_position, self.current_input.length)
      self.current_input_position += encoded.length;
    }
    self.update();
  }

  to_html() {
    var html_output = this.first_line;
    var input_html = "";
    if (this.input) {
      var ci = this.current_input;
      ci = ci.substring(0, this.current_input_position) +
         '<span class="cursor ' +
         this.cursor_blink +
         '">|</span>' +
         ci.substring(this.current_input_position, this.current_input.length)
      input_html = '<div class="console-input">> ' + ci + '</div>'
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
    this.elem.innerHTML = this.to_html();
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
