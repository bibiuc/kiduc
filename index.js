function Kiduc() {
  if (!this instanceof Kiduc) {
    return new Kiduc();
  }
  var self = this;
  var scope = {};
  var hooks = {};
  var cache = {};
  var running = true;
  var tasks = [];
  var slice = Array.prototype.slice;
  var hookKeys = ['onBeforeSet', 'onAfterSet', 'onBeforeRun', 'onAfterRun', 'onRunError'];
  var runHooks = function(name) {
    try{
      var args = slice.call(arguments, 1);
      i = 0,
        hs = hooks[name],
        len = hs.length;
      for(;i < len; i++) {
        hs[i].apply(null, args);
      }
    } catch (e) {
      console.error('base_run ' + self.word('function_error'), e);
    }
  };
  (function () {
    var len = hookKeys.length;
    for(var i = 0; i < len; i++) {
      hooks[hookKeys[i]] = [];
    }
  })();
  this.hookKeys = hookKeys;
  this.hook = function(target, hook, before) {
    if (arguments.length < 2 ||
      !hooks[target] ||
      typeof hook != 'function') {
      console.error('base_hook ' + self.word('arguments_error'));
      return;
    } else if (before === undefined || isNaN(before)) {
      before = hooks[target].length;
    }
    hooks[target].splice(before, 0, hook);
  };
  this.word = function(word) {
    return {
      'arguments_error': '参数错误',
      'scope_key_reset': '已存在的值,将被重置',
      'unsafe_set': '不安全的设置',
      'function_error': '运行时错误',
      'no_handle': '未找到函数'
    }[word];
  };
  this.set = function(id, func) {
    if (arguments.length != 2) {
      console.error('base_set ' + self.word('arguments_error'));
      return;
    }
    if (scope[id]) {
      console.warn(['base_set', self.word('scope_key_reset'), id].join(' '));
    }
    if (typeof func != 'function') {
      try {
        func = new Function('return ' + JSON.stringify(func) + ';');
      } catch(e) {
        console.warn(['base_set', self.word('unsafe_set'), id].join(' '));
        func = (function(obj) {
          return obj;
        }).bind(null, func);
      }
    }
    runHooks('onBeforeSet', arguments);
    scope[id] = func;
    runHooks('onAfterSet', arguments);
  };
  this.cache = function(id, value) {
    if (value === undefined) {
      return cache[id];
    }
    cache[id] = value;
  };
  this.run = function(id) {
    if (scope[id]) {
      var args = slice.call(arguments, 1);
      return new Promise(function (resolve) {
        tasks.push([id, resolve].concat(args));
      });
    }
    console.log('base_run', self.word('no_handle'), id);
    return Promise.resolve(undefined);
  };
  this.stop = function() {
    running = false;
    tasks = [];
  };
  this.start = function() {
    process.nextTick(tasks.forEach.bind(tasks, function (args) {
      var ret,
        id = args[0],
        resolve = args[1],
        handle = scope[id],
        args = slice.call(args, 2);
      try {
        runHooks('onBeforeRun', args);
        ret = handle.apply({id: id}, args);
        runHooks('onAfterRun', args, ret);
        resolve(ret);
      } catch(e) {
        resolve(undefined);
        console.error('base_run ' + self.word('function_error'), e);
        runHooks('onRunError', args, e);
      }
    }), 0);
    tasks = [];
    if (running) {
      setTimeout(function() {
          self.start();
      });
    }
  };
  self.start();
}
 module.exports = Kiduc;