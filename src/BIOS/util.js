console.output = [];
var _console_input = "";

var _log = console.log,
    _warn = console.warn,
    _error = console.error;

function str(arg) {
  if ((arg.length == 1) || (typeof(arg) == typeof("STR"))) {
    return arg[0]
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

console.to_html = function() {
  html_output = "VWPC/0.0.1<br>";
  for (var line of console.output) {
    if (line.startsWith("[INFO] ")) {
      color = "i"
    }
    else if (line.startsWith("[WARN] ")) {
      color = "w"
    }
    else if (line.startsWith("[ERROR] ")) {
      color = "e"
    }
    else {
      color = "l"
    }
    html_output += "<span class='console-" + color + "'>" + line + "</span><br>"
  }
  return html_output + '<div id="console-input">> <input type="text" value="' + _console_input + '"><span class="cursor blink">|</span></div>'
}

function update_console() {
  document.getElementById("console-output").innerHTML = console.to_html()
  var input = document.querySelector("#console-input > input[type=text]")
  input.addEventListener('input', resizeInput);
  resizeInput.call(input);
  function resizeInput() {
    _console_input = this.value
    this.style.width = this.value.length + "ch";
  }
  input.selectionStart = input.selectionEnd = input.value.length;
  input.focus();
}

console.debug = function() {
    console.output.push("[DEBUG] " + str(arguments));
    update_console();
    return _log.apply(console, arguments);
};
console.debug("Started console listener 'debug'")

console.info = function() {
    console.output.push("[INFO] " + str(arguments));
    update_console();
    return _log.apply(console, arguments);
};
console.debug("Started console listener 'info'")

console.log = function() {
    console.output.push("[LOG] " + str(arguments));
    update_console();
    return _log.apply(console, arguments);
};
console.debug("Started console listener 'log'")

console.warn = function() {
    console.output.push("[WARN] " + str(arguments));
    update_console();
    return _warn.apply(console, arguments);
};
console.debug("Started console listener 'warn'")

console.error = function() {
    console.output.push("[ERROR] " + str(arguments));
    update_console();
    return _error.apply(console, arguments);
};
console.debug("Started console listener 'error'")

console.debug("Loaded util.js")
