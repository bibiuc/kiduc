hasProto = !!{}.__proto__
hasSetProto = !!Object.setPrototypeOf
class Args
  getKey = (arg)->
    if typeof arg == 'string'
      arg
    else
      arg.key
  getValue = (arg, kiduc)->
    if typeof arg != 'string'
      switch arg.type
        when 'static' then arg.value
        when 'dynamic' then kiduc.run.apply(kiduc, arg.value)

  constructor: (args, kiduc)->
    @kiduc = kiduc
    @keys = () ->
      getKey(arg) for arg in args
    @values = () ->
      getValue(arg, kiduc) for arg in args
    @mixin = (options) ->
      data = for key, i in @keys()
        if options[key]
          options[key].key = key
          options[key]
        else
          args[i]
      new Args(data, kiduc)
      
class Kiduc
  $scope = Symbol('scope')
  constructor:(scope) ->
    @[$scope] = {}
    @scope = scope;
    return
  add: (name, args) ->
    [args..., content] = args;
    args = new Args(args, this)
    @[$scope][name] = {
      args: args,
      content: content,
      handler: new Function(args.keys()..., content)
    };
  run: (name, scope, options) ->
    item = @[$scope][name]
    if (item)
      globalScope = @scope;
      args = item.args.mixin(options).values();
      item.handler.apply({
        scope: scope,
        global: globalScope
      }, args);
  defaults: (name) ->
    {args} = @[$scope][name]
    args.values();
  reset: (scope)->
    @[$scope] = {}
    @scope = scope || @scope
  clone: (deep)->
    scope = @scope
    handles = @[$scope]
    if (deep)
      next = new Kiduc({scope...})
      next[$scope] = {handles...}
    else
      next = new Kiduc(scope)
      next[$scope] = handles
    next
  next: (scope = {})->
    next = new Kiduc(scope)
    if hasProto
      next.scope.__proto__ = @scope
      next[$scope].__proto__ = @[$scope]
    else if hasSetProto
      Object.setPrototypeOf(next.scope, @scope)
      Object.setPrototypeOf(next[$scope], [$scope])
    else
      next = @clone()
    next

module.exports = Kiduc;