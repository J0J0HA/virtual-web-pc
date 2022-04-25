console.output = [];

var _log = console.log,
    _warn = console.warn,
    _error = console.error;

console.log = function() {
    console.output.push({method: 'log', arguments: arguments});
    return _log.apply(console, arguments);
};

console.warn = function() {
    console.output.push({method: 'warn', arguments: arguments});
    return _warn.apply(console, arguments);
};

console.error = function() {
    console.output.push({method: 'error', arguments: arguments});
    return _error.apply(console, arguments);
};

console.log("Loaded util.js")
