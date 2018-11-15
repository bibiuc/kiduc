var Kiduc = require('./index.js');

var base = new Kiduc();
base.set('startup', function() {
  console.log('dev');
});

base.set('env', process.env);
base.run('startup', ['env']);