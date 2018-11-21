var Kiduc = require('./index.js');

var base = new Kiduc({name: 'global'});
base.add('st', ['return "default static";']);
base.add('startup', ['dy', 'st', 'dyA', 'stA', 'console.log([dy, st, dyA, stA].join(","),this.global, this.scope);'], {dy: 'dy'}, {dy: 'default dynamic'});
base.add('dyA', ['return "arguments static";']);
base.run('startup', {name: 'scope'}, {stA: 'dyA'}, {dyA: 'arguments dynamic'});