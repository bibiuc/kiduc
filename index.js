function Kiduc() {
  if (!this instanceof Kiduc) {
    return new Kiduc();
  }
  var self = this;
  var scope = {};
  var hooks = {};
  var cache = {};
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
      'function_error': '运行时错误'
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
  this.run = async function(id) {
    var _args = arguments;
    var args = slice.call(arguments, 1);
    var key,
      i = 0,
      len = args.length;
    for(;i < len; i++) {
      key = args[i];
      if (key instanceof Array) {
        args[i] = await self.run.apply(self, key) || key;
      } else if (typeof key == 'string') {
        args[i] = self.cache(key) || key;
      }
    }
    return new Promise(function(resolve) {
      try {
        runHooks('onBeforeRun', _args, args);
        args = (scope[id]).apply(null, args);
        resolve(args);
        runHooks('onAfterRun', _args, args);
      } catch(e) {
        console.error('base_run ' + self.word('function_error'), e);
        runHooks('onRunError', _args, e);
        resolve(undefined);
      }
    });
  };
}
 module.exports = Kiduc;