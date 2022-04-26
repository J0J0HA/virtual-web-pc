class CustomConsole {
  elem = undefined;
  input = false;
  output = [];
  listener_id = undefined;
  current_input = "";
  command_handler = undefined;

  constructor(elem, input=false) {
    this.elem = elem;
    this.input = input;
    this.update();
  }

  focus() {
    this.listener_id = listeners.listen("keydown", this.handler, [this])
  }

  unfocus() {
    listeners.unlisten(this.listener_id)
  }

  handler(self) {
    if (event.key === "Enter") {
      self.output.push("> " + self.current_input);
      if (self.command_handler) {
        self.command_handler(self.current_input);
      } else {
        self.error("No command handler defined! Command ignored.");
      }
      self.current_input = "";
    }
    else if (event.key === "Shift") {
      // Just do nothing.
    }
    else if (event.key === "Backspace") {
      self.current_input = self.current_input.substring(0, self.current_input.length - 1);
    }
    else if (event.key.length != 1) {
      self.warn("Ignored special key: " + event.key);
    }
    else {
      self.current_input += event.key;
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
    while (this.output.length > 200) {
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
