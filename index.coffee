class Kiduc
  $scope = Symbol('scope')
  constructor:(scope) ->
    @[$scope] = {}
    @scope = scope;
    return
  add: (name, args, defaults) ->
    [args..., content] = args;
    @[$scope][name] = {
      args: args,
      defaults: {defaults...},
      content: content,
      handler: new Function(args..., content)
    };
  run: (name, scope, static_args = {}, dynamic_args = {}) ->
    item = @[$scope][name]
    args = for key in item.args
      if (dynamic_args[key])
        dynamic_args[key]
      else if (static_args[key])
        @run(static_args[key], scope)
      else
        item.defaults[key]
    item.handler.apply({
      scope: scope,
      global: @scope
    }, args);

module.exports = Kiduc;