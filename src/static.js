var static = {
  bios: {
    name: {
      plain: "VWPC-BIOS",
      full: "invalid"
    },
    version: {
      string: "invalid",
      release: 1,
      patch: 1,
      update: 18,
      stage: "alpha",
    }
  }
};

static.bios.version.string = static.bios.version.release + "." + static.bios.version.patch + "-" + static.bios.version.stage + static.bios.version.update
static.bios.name.full = static.bios.name.plain + " " + static.bios.version.string

String.prototype.insert = function (index, value) {
  return this.slice(0, index)  + value + this.slice(index, this.length);
}
String.prototype.cutout = function (from, to) {
  return this.slice(0, from) + this.slice(to, this.length);
}

function str(arg) {
  if (typeof(arg) == typeof("STR")) {
    return arg
  }
  else if (typeof(arg) == typeof(123)) {
    return arg.toString();
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
  return "Unknown object: " + arg
}

function html_escape (string, cursorblink=false) {
  string = string.replace("&", "&amp;");
  string = string.replace(/[\u00A0-\u9999<>\&]/g,
    function(i) {
      return '&#'+i.charCodeAt(0)+';';
    }
  );
  string = string.replace("<", "&lt;");
  string = string.replace(">", "&gt;");
  string = string.replace(" ", "&nbsp;");
  string = string
    .replaceAll('!!SHOWCURSOR:BLINKING!!', '<span class="console-cursor console-blink">|</span>')
    .replaceAll('!!SHOWCURSOR:PAUSED!!', '<span class="console-cursor">|</span>')
    .replaceAll('!!SHOWCURSOR!!',
      function(focused) {
        if (focused) {
          return '<span class="console-cursor console-blink">|</span>'
        }
        else {
          return '<span class="console-cursor">|</span>'
        }
      } (cursorblink)
    )
  return string;
}
