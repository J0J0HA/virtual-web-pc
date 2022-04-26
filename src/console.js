class CustomConsole {
  elem = undefined;
  input = true;
  output = [];
  listener_id = undefined;
  current_input = "";
  max_output = Infinity;
  max_input = Infinity;
  command_handler = undefined;

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
    if (event.key == "Enter") {
      self.output.push("> " + self.current_input);
      if (self.command_handler) {
        self.command_handler(self.current_input);
      } else {
        self.error("No command handler defined! Command ignored.");
      }
      self.current_input = "";
    }
    else if (event.key == "Escape") {
      self.warn("Escape not yet supported")
    }
    else if (event.key == "ArrowUp") {
      self.warn("Arrows not yet supported")
    }
    else if (event.key == "ArrowDown") {
      self.warn("Arrows not yet supported")
    }
    else if (event.key == "ArrowLeft") {
      self.warn("Arrows not yet supported")
    }
    else if (event.key == "ArrowRight") {
      self.warn("Arrows not yet supported")
    }
    else if (event.key == "Dead") {
      if (self.current_input.length >= self.max_input) {
        return;
      }
      if (event.keyCode == 220) {
        self.current_input += "^";
      }
      else if (event.keyCode == 221) {
        self.current_input += prompt("Please retype the letter:", "`")
      }
    }
    else if (["Shift", "Meta", "Control", "Alt", "AltGraph", "ContextMenu", "CapsLock", "Tab"].indexOf(event.key) != -1) {
      // Just do nothing.
    }
    else if (["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].indexOf(event.key) != -1) {
        self.warn("F-Buttons not yet supported");
    }
    else if (event.key == "Backspace") {
      self.current_input = self.current_input.substring(0, self.current_input.length - 1);
    }
    else if (event.key.length != 1) {
      self.warn("Ignored special key: " + event.key);
    }
    else {
      if (self.current_input.length >= self.max_input) {
        return;
      }
      var encoded = event.key.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
      });
      self.current_input += encoded;
    }
    self.update();
  }

  to_html() {
    var html_output = "<br>VWPC 0.0.3<br>";
    var input_html = "";
    if (this.input) {
      input_html = '<div class="console-input">> <span id="input">' + this.current_input + '</span><span class="cursor blink">|</span></div>'
    }
    for (var line of this.output) {
      var color = "l"
      if (line.startsWith("[INFO] ")) {
        color = "i"
      }
      else if (line.startsWith("[WARN] ")) {
        color = "w"
      }
      else if (line.startsWith("[ERROR] ")) {
        color = "e"
      }
      html_output += "<span class='console-line-" + color + "'>" + line + "</span><br>"
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
      this.output.push("[DEBUG] " + str(msg));
      this.update();
  };

  info(msg) {
      this.output.push("[INFO] " + str(msg));
      this.update();
  };

  write(msg) {
      this.output.push(str(msg));
      this.update();
  };

  log(msg) {
      this.output.push("[LOG] " + str(msg));
      this.update();
  };

  warn(msg) {
      this.output.push("[WARN] " + str(msg));
      this.update();
  };

  error(msg) {
      this.output.push("[ERROR] " + str(msg));
      this.update();
  };
}
