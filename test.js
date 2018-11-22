var Kiduc = require('./index.js');

var base = new Kiduc({name: 'global'});
base.add('st', ['return "default static";']);
base.add('startup', ['dy', 'st', 'dyA', 'stA', 'console.log([dy, st, dyA, stA].join(","),this.global, this.scope);'], {st: 'st'}, {dy: 'default dynamic'});
base.add('dyA', ['return "arguments static";']);
var base2 = base.clone(true);
base2.add('st', ['return "default static 2";']);
base.run('startup', {name: 'scope'}, {stA: 'dyA'}, {dyA: 'arguments dynamic'});
var next = base.next();
next.run('startup', {name: 'scope'}, {stA: 'dyA'}, {dyA: 'arguments dynamic'});
console.log(Object.keys(base));