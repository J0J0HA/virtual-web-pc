const title = document.getElementsByTagName("title")[0];
const cout = new CustomConsole(document.getElementById("console-output"), true);
cout.command_handler = function(cmd) {
  if (cmd.startsWith("!")) {

  }
}
cout.focus();
