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
      scope: scope,
      global: @scope
    }, args);

module.exports = Kiduc;