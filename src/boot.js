async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run_if(resultfunc, conditionfunc) {
  if (conditionfunc()) {
    return resultfunc();
  }
}

async function sleep_until(func, ms) {
  return new Promise((resolve) => {
    setInterval(() => {
      run_if(resolve, func)
    }, ms)
  });
}

async function log(msg) {
  $out.append(msg + "<br>");
  await sleep(300);
}

async function lognl() {
  await log("");
}

async function logdel() {
  $out.empty();
}

async function boot() {
  window.os = localStorage.getItem("oslink")
  $out = $("#console-output");
  $out.empty();
  await sleep(1000);
  $head = $("head");
  await log("Booting...");
  await lognl();
  await log("Loading styles...");
  await sleep(300);
  $head.append('<!-- +<CONSOLE:STYLE> --><link rel="stylesheet" type="text/css" href="src/main.css" onload="window.__styles_loaded = true;"><!-- -<CONSOLE:STYLE> -->');
  await sleep_until(() => {return window.__styles_loaded}, 100);
  await sleep(400);
  await log("Styles loaded.");
  await lognl();
  await log("Downloading OS...");
  await sleep(300);
  if (window.os) {
    oslink = window.os;
  } else {
    await log("No OS to load. Booting in BIOS...")
    oslink = "src/bios.js";
  }

  $head.append('<!-- +<OS:JS> --><script src="' + oslink + '" async defer onload="window.__os_loaded = true;"></script><!-- -<OS:JS> -->');
  await sleep_until(() => {return $OS$ || window.__os_loaded}, 100);
  await sleep(400);
  await log("OS downloaded.");
  await lognl();
  await sleep(700);
  if (!$OS$) {
    await log("OS not bootable! Refresh page to retry.")
  }
  await log("Running OS called '" + $OS$.name + "'...");
  await sleep(600);
  await $OS$.boot();
}
