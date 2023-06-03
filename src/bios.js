const $OS$ = {
  boot: async function() {
    await logdel();
    items = ["I AM THE BIOS!", "IT WORKS", "SUPRISED?", "HELLO WORLD!", "BANANAS"];
    setInterval(async () => {
      await logdel();
      log("Greetings from the BIOS...");
      await log(items[Math.floor(Math.random()*items.length)]);
    }, 500);
  },
  name: "BIOS"
}
