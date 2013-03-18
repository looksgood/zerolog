var ZeroLog = require('../lib/ZeroLog');

var zeroLog = new ZeroLog();

//zeroLog.log('info', 'test result: ', {type: 'test', name: 'zerolog'});
//zeroLog.log('this is test log');
//zeroLog.log({level: 'info', msg: 'this is info message', });

log('info', 'test result: ', {type: 'test', name: 'zerolog'})
function log(){
  zeroLog.log(arguments);
}
