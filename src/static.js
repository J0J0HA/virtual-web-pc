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
      update: 13,
      stage: "alpha",
    }
  }
};

static.bios.version.string = static.bios.version.release + "." + static.bios.version.patch + "-" + static.bios.version.stage + static.bios.version.update
static.bios.name.full = static.bios.name.plain + " " + static.bios.version.string
