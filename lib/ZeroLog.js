var util = require('util'),
  ZeroMQ = require('./ZeroMQ'),
  defalutLevel = 'debug';

var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

function ZeroLog(options) {
  this.config = {
    type: 'dealer',
    endpoint: 'ipc:///tmp/zeroMQServer.ipc',
    db: 'ZeroLog',
    table: 'log',
    //rollDateFormat: 'yyyy_ww' // roll date with week
  };

  for (var i in options) {
    if (options.hasOwnProperty(i)) {
      this.config[i] = options[i];
    }
  }
  this.zeroMQ = new ZeroMQ(this.config);
}

ZeroLog.prototype = {
  log: function() {
    var length = arguments.length,
      level = "",
      content = "";

    switch (length) {
      case 0:
        return;
        break;
      case 1:
        content = arguments[0];
        if (content.level) {
          level = content.level;
          delete content.level;
        }
        break;
      default:
        var args = Array.prototype.slice.call(arguments);
        level = args.shift();
        content = this.formatData(args);
        break;
    }

    var logObj = {
      db: this.config.db,
      table: this.config.table,
      rollDateFormat: this.config.rollDateFormat,
      level: toLevel(level),
      content: content
    };
    //console.log('logStr: ', JSON.stringify(logObj));
    this.zeroMQ.send(JSON.stringify(logObj));
  },
  setSaveOpt: function(options) {
    for (var i in options) {
      if (options.hasOwnProperty(i)) {
        this.config[i] = options[i];
      }
    }
  },
  formatData: function(logData) {
    var output = "",
      data = Array.isArray(logData) ? logData.slice() : Array.prototype.slice.call(arguments)
      format = data.shift(),
      replacementRegExp = /%[sdj]/g;

    if (typeof format === "string") {
      output = format.replace(replacementRegExp, function(match) {
        switch (match) {
          case "%s":
            return new String(data.shift());
          case "%d":
            return new Number(data.shift());
          case "%j":
            return JSON.stringify(data.shift());
          default:
            return match;
        }
      });
    } else {
      //put it back, it's not a format string
      data.unshift(format);
    }

    data.forEach(function(item) {
      if (output) {
        output += ' ';
      }
      if (item && item.stack) {
        output += item.stack;
      } else {
        output += util.inspect(item);
      }
    });

    return output;
  }
};

function toLevel(level) {
  if ('string' == typeof(level)) {
    var Level = level.toLowerCase();
    if (levels.indexOf(Level) > -1) {
      return Level;
    }
  }

  return defalutLevel;

}
exports = module.exports = ZeroLog;