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
