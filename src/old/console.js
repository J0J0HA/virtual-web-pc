class CustomConsole {
  elem = undefined;
  input = true;
  output = [];
  output_raw = [];
  listener_id = undefined;
  current_input = "";
  current_history_position = 0;
  current_input_position = 0;
  history = [];
  focused = false;
  first_line = "<br>";
  max_output = Infinity;
  max_input = Infinity;
  command_handler = undefined;
  show_types = {
    debug: false,
    info: true,
    log: true,
    plain: true,
    warn: true,
    error: true
  };

  constructor(elem) {
    this.elem = elem;
  }

  focus() {
    this.listener_id = listeners.listen("keydown", this.handler, [this]);
    this.focused = true;
    this.update();
  }

  unfocus() {
    listeners.unlisten("keydown", this.listener_id);
    this.focused = false;
    this.update();
  }

  handler(self) {
    if (event.key == "Enter") {
      self.plain("> " + self.current_input);
      self.history.unshift(self.current_input);
      if (self.command_handler) {
        self.command_handler(self.current_input);
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
      self.current_input_position --;
    }
    else if (event.key == "ArrowRight") {
      self.current_input_position ++;
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
    else if (["Dead", "Shift", "Meta", "OS", "Control", "Alt", "AltGraph", "ContextMenu", "CapsLock", "ScrollLock", "NumLock"].indexOf(event.key) != -1) {
      self.debug("Key ignored. No Typeable Key.")
    }
    else if (event.key == "Unidentified" && key.keyCode == 229) {
      self.debug("Mobile input.")
    }
    else if (event.key == "Unidentified") {
      self.warn("Unknown key: " + event.keyCode)
    }
    else if (["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].indexOf(event.key) != -1) {
      self.warn("F-Buttons not yet supported");
    }
    else if (event.key == "Backspace") {
      self.current_input = self.current_input.cutout(self.current_input_position - 1, self.current_input_position);
      self.current_input_position --;
    }
    else if (event.key == "Delete") {
      self.current_input = self.current_input.cutout(self.current_input_position, self.current_input_position + 1);
    }

    // BLOCK TOO MUCH CHARS
    else if (self.current_input.length >= self.max_input) {
         return;
    }

    // KEYS THAT WRITE
    else if (event.key.startsWith("`") || event.key.startsWith("´") || event.key.startsWith("^")) {
      self.current_input = self.current_input.insert(self.current_input_position, event.key);
      self.current_input_position += event.key.length;
    }
    else if (event.key == "Tab") {
      self.current_input = self.current_input.insert(self.current_input_position, "    ")
      self.current_input_position += 4;
    }
    else if (event.key.length != 1) {
      self.warn("Ignored special key: " + event.key);
    }
    else {
      self.current_input = self.current_input = self.current_input.insert(self.current_input_position, event.key)
      self.current_input_position ++;
    }
    if (self.current_input_position > self.current_input.length) self.current_input_position = self.current_input.length;
    if (self.current_input_position < 0) self.current_input_position = 0;
    self.update();
  }

  _to_html() {
    var html_output = this.first_line;
    var input_html = "";
    if (this.input) {
      var ci = this.current_input;
      ci = ci.substring(0, this.current_input_position) +
           "!!SHOWCURSOR!!" +
           ci.substring(this.current_input_position, ci.length)
      input_html =
        '<div class="console-input">> ' +
        html_escape(ci, this) +
        '</div>'
    }
    for (var line of this.output) {
      if (this.show_types[line.type]) html_output += line.html + "<br>";
    }
    return html_output + input_html + "<span class='stay-focused'></span>";
  }

  update() {
    while (this.output.length > this.max_output) {
      this.output.shift();
    }
    this.elem.innerHTML = this._to_html();
    this.elem.children[this.elem.children.length - 1].scrollIntoView()
  }

  type_input(text) {
    for (var char of text) {
      this.current_input += char;
      this.current_input_position ++;
    }
    this.update();
  };

  write(msg, type="plain", attributes="") {
    var encoded =
      html_escape(
        str(msg),
        this
      )
        .replaceAll("\n", "<br>")
    this.output.push({
      html: '<span class="console-line-' + type + '" ' + attributes + '>' + encoded + '</span>',
      raw: msg,
      method: "RAW",
      time: Date.now(),
      type: type
    });
    this.update();
  };

  html(html, type) {
    this.output.push({
      html: html,
      raw: html.replace(/<[^>]*>/g, ''),
      method: "HTML",
      time: Date.now(),
      type: type
    });
    this.update();
  };

  debug(msg) {
    this.write(str(msg), "debug");
  };

  info(msg) {
    this.write(str(msg), "info");
  };

  log(msg) {
    this.write(str(msg), "log");
  };

  warn(msg) {
    this.write(str(msg), "warn");
  };

  error(msg) {
    this.write(str(msg), "error");
  };

  text = this.write;
  plain = this.write;
  raw = this.write;
  warning = this.warn;
}
