var ZeroMQ = require('./ZeroMQ');

function ZeroLog(options) {
  this.config = {
    type: 'dealer',
    endpoint: 'ipc:///tmp/zeroMQServer.ipc',
    db: 'ZeroLog',
    table: 'log'
  };

  for(var i in options) {
    if(options.hasOwnProperty(i)) {
      this.config[i] = options[i];
    }
  }
  this.zeroMQ = new ZeroMQ(this.config);
}

ZeroLog.prototype = {
  log: function(level, content) {
    var logObj = {
      db: this.config.db,
      table: this.config.table,
      level: level,
      content: content
    };
    this.zeroMQ.send(JSON.stringify(logObj));
  },
  setSaveOpt: function(options) {
    for(var i in options) {
      if(options.hasOwnProperty(i)) {
        this.config[i] = options[i];
      }
    }
  }
};

exports = module.exports = ZeroLog;