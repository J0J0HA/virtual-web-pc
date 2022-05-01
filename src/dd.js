function $$(...args) {
  throw new Error("DoubleDollar does not support this yet.");
}

$$.init = function () {
  $$.__init_prototypes();
}

$$.__init_prototypes = function () {
  String.prototype.insert = function (index, value) {
    return this.slice(0, index)  + value + this.slice(index, this.length);
  }
  String.prototype.cutout = function (from, to) {
    return this.slice(0, from) + this.slice(to, this.length);
  }
}

$$.init();
