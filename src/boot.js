const title = document.getElementsByTagName("title")[0];
const cout = new CustomConsole(document.getElementById("console-output"), true);
cout.command_handler = function(cmd) {
  cout.write("Recived: '" + cmd + "'")
}
cout.focus();
