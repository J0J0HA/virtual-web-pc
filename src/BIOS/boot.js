function boot() {
  _html = console.to_html
  _up
  console.to_html = function() {
    return _html() + '<div id="console-input">> <input type="text" value="' + _console_input + '" onkeyup="if (event.keyCode == 13) {_console_input = \'\'; update_console();}"><span class="cursor blink">|</span></div>'
  }
}
console.debug("Loaded boot.js")
