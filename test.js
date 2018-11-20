var Kiduc = require('./index.js');

var base = new Kiduc();
base.add('startup', ['demo', 'play', 'other', 'console.log(demo, this.global, play, other);'], {other: '666'});
base.add('demo', ['console.log(111); return 222;']);
base.run('startup', {}, {demo: 'demo'}, {demo: 444, play: 333});