var Kiduc = require('./index.js');

var base = new Kiduc({name: 'global'});
base.add('st', ['return "default dynamic";']);
base.add('startup', [{key: 'st', type: 'static', value: 'default static'}, {key: 'dy', type: 'dynamic', value: ['st']}, 'dyA', {key: 'stA'}, 'console.log([dy, st, dyA, stA].join(","), this, this.global, this.scope);']);
base.add('dyA', ['return "arguments dynamic";']);
var base2 = base.clone(true);
base2.add('st', ['return "default static 2";']);
base.run('startup', {name: 'scope'}, {
  dyA: {type: 'dynamic', value: ['dyA']},
  stA: {type: 'static', value: 'arguments dynamic'}
});
var next = base.next();
next.run('startup', {name: 'scope'}, {
  dyA: {type: 'dynamic', value: ['dyA']},
  stA: {type: 'static', value: 'arguments static'}
});
console.log(Object.keys(base));

var base = new Kiduc();

base.add('startup', ["env", "return 'boot';"]);

base.add('env', ['return process.env']);
console.time('startup');
(async function() {
  await base.run('startup', null, {
    env: {type: 'dynamic', value: ['env']}
  });
  console.timeEnd('startup');
})();