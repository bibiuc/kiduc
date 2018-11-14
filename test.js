var Kiduc = require('./index.js');

var base = new Kiduc();

base.set('startup', async function(env) {
  return 'boot';
});

base.set('env', process.env);
console.time('startup');
(async function() {
  await base.run('startup', ['env']);
  console.timeEnd('startup');
})();