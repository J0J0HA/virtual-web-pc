class CustomConsole {
  constructor(elem, input=false) {
    this.elem = elem;
    this.input = input;
    this.output = [];
    this.current_input = "";
    // this.update();
  }

  to_html() {
    var html_output = "";
    var input_html = "";
    if (this.input) {
      input_html = '<div class="console-input">> <input type="text" value="' + this.current_input + '"><span class="cursor blink">|</span></div>'
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
    return html_output + input_html
  }

  update() {
    this.elem.innerHTML = this.to_html()
    var self = this;
    if (this.input) {
      var input = this.elem.getElementsByTagName("input")[0]
      input.addEventListener('input', onInput);
      onInput.call(input);
      function onInput() {
        self.current_input = this.value;
        this.style.width = this.value.length + "ch";
        if (event.keyCode == 13) {
          self.handler(this.current_input);
          self.current_input = "";
          self.update();
        }
      }
      input.focus();
    }
    input.selectionStart = input.selectionEnd = input.value.length;
    input.focus();
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

function str(arg) {
  if (typeof(arg) == typeof("STR")) {
    return arg
  } else if (typeof(arg) == typeof(["LIST"])) {
    result = "["
    for (var line of arg) {
      result += str(line) + ", "
    }
    return result += "]"
  } else if (typeof(arg) == typeof({"DICT": "DICT"})) {
    result = "{"
    for (var line in arg) {
      result += str(line) + ": " + str(arg[line]) + ", "
    }
    return result += "}"
  }
  return "UNKOWN OBJECT"
}

console.debug("Loaded util.js")
