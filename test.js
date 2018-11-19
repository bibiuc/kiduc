var Kiduc = require('./index.js');

var base = new Kiduc();
base.set('startup', function() {
  console.log(this);
  console.log('dev');
  return 'demo';
});

base.set('env', process.env);
base.run('startup', ['env']).then(function() {
  console.log(arguments);
  base.runSync('startup', ['env']);
  base.stop();
});
