var colors = require('colors');

module.exports = {
    log: function(color, fmt) {
        var params = Array.prototype.slice.call(arguments, 2);
        params.unshift(new Date().toISOString());
        params.unshift('[%s]'.cyan.underline + ' ' + fmt[color]);
        console.log.apply(console, params);
    },
    info: function() {
        var params = Array.prototype.slice.call(arguments);
        params.unshift('green');
        module.exports.log.apply(module.exports, params);
    },
    error: function() {
        var params = Array.prototype.slice.call(arguments);
        params.unshift('red');
        module.exports.log.apply(module.exports, params);
    },
    timer: function(){
        var params = Array.prototype.slice.call(arguments);
        params.unshift('grey');
        module.exports.log.apply(module.exports, params);
    }
};