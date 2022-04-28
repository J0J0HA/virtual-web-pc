var listeners = {
  listeners: {
    keydown: [],
    keyup: []
  },
  init: function () {
    document.body.addEventListener("keydown", function() {
      for (var listener of listeners.listeners.keydown) {
        if (listener) {
          listener[0](...listener[1]);
        }
      }
      event.preventDefault()
    })
    document.body.addEventListener("keyup", function() {
      var ret = null;
      for (var listener of listeners.listeners.keyup) {
        if (listener) {
          ret = listener[0](...listener[1]);
        }
      }
      event.preventDefault()
    })
  },
  listen: function (event, func, args) {
    listeners.listeners[event].push([func, args]);
    return listeners.listeners[event].length
  },
  unlisten: function (event, id) {
    var func = listeners.listeners[event][id - 1];
    listeners.listeners[event][id - 1] = undefined;
    return func
  }
}

listeners.init();
