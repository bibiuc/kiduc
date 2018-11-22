hasProto = !!{}.__proto__
hasSetProto = !!Object.setPrototypeOf
class Kiduc
  $scope = Symbol('scope')
  constructor:(scope) ->
    @[$scope] = {}
    @scope = scope;
    return
  add: (name, args, static_defaults, dynamic_defaults) ->
    [args..., content] = args;
    @[$scope][name] = {
      args: args,
      static_defaults: {static_defaults...},
      dynamic_defaults: {dynamic_defaults...},
      content: content,
      handler: new Function(args..., content)
    };
  run: (name, scope, static_args = {}, dynamic_args = {}) ->
    item = @[$scope][name]
    if (item)
      globalScope = @scope;
      args = for key in item.args
        if (dynamic_args.hasOwnProperty(key))
          dynamic_args[key]
        else if (static_args.hasOwnProperty(key))
          @run(static_args[key], scope)
        else if (item.dynamic_defaults.hasOwnProperty(key))
          item.dynamic_defaults[key]
        else if (item.static_defaults.hasOwnProperty(key))
          @run(item.static_defaults[key], scope)
      item.handler.apply({
        scope...,
        globalScope...
      }, args);
  defaults: (name, scope) ->
    {dynamic_default, static_defaults} = @[$scope][name]
    ret = {dynamic_default...}
    for key in static_defaults
      if (!ret.hasOwnProperty(key))
        ret[key] = @run(static_defaults[key], scope)
    ret
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