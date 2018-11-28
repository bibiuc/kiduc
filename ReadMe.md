#kiduc
代码离散存储
```javascript
    var Kiduc = require('kiduc');
    
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
```
