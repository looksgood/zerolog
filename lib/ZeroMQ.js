var zmq = require('zmq');

exports = module.exports = ZeroMQ;

function ZeroMQ(options) {
  var self = this;
  this.config = {
    type: 'dealer',
    endpoint: 'ipc:///tmp/zeroMQServer.ipc',
  };

  for (var i in options) {
    if (options.hasOwnProperty(i)) {
      this.config[i] = options[i];
    }
  }

  this.initial();
  process.on('SIGINT', function() {
    if (self.socket) {
      self.socket.close();
    }
    process.exit(0);
  });
}

ZeroMQ.prototype = {
  initial: function() {
    this.socket = zmq.socket(this.config.type);
    this.socket.identity = 'client' + process.pid;
    this.socket.connect(this.config.endpoint);
    //console.log('connected endpoint: ' + this.config.endpoint);

    this.socket.on('message', function(data) {
      //console.log('data: ', data);
    });
  },
  send: function(msg) {
    if (this.socket) {
      //console.log('send msg: ', msg);
      this.socket.send(msg);
    }
  },
  setsockopt: function(opt, val) {
    if (this.socket) {
      this.socket.setsockopt(opt, val);
    }
  }

};