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
      update: 14,
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
