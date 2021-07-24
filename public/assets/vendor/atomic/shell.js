define(['exports', 'atomic/core', 'atomic/reactives', 'atomic/transients', 'atomic/immutables'], function (exports, _, $, mut, imm) { 'use strict';

  var IDispatch = _.protocol({
    dispatch: null
  });

  var dispatch$3 = IDispatch.dispatch;

  var IHandler = _.protocol({
    handles: null
  });

  var handles$2 = IHandler.handles;

  var IEventProvider = _.protocol({
    raise: null,
    release: null
  });

  var raise$1 = IEventProvider.raise;
  var release$1 = IEventProvider.release;

  var IMiddleware = _.protocol({
    handle: null
  });

  function handle2(self, message) {
    return IMiddleware.handle(self, message, _.noop);
  }

  var handle$a = _.overload(null, null, handle2, IMiddleware.handle);

  var p = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dispatch: dispatch$3,
    handles: handles$2,
    raise: raise$1,
    release: release$1,
    handle: handle$a
  });

  function Bus(state, handler) {
    this.state = state;
    this.handler = handler;
  }
  function bus(state, handler) {
    return new Bus(state, handler);
  }

  function dispatch$2(self, command) {
    handle$a(self.handler, command);
  }

  function dispose(self) {
    _.satisfies(_.IDisposable, self.state) && _.dispose(self.state);
    _.satisfies(_.IDisposable, self.handler) && _.dispose(self.handler);
  }

  var behave$d = _.does(_.forward("state", $.ISubscribe, _.IDeref, _.IReset, _.ISwap, _.IReduce), _.implement(IDispatch, {
    dispatch: dispatch$2
  }), _.implement(_.IDisposable, {
    dispose: dispose
  }));

  behave$d(Bus);

  function Events(queued) {
    this.queued = queued;
  }
  function events() {
    return new Events([]);
  }

  function raise(self, event) {
    self.queued.push(event);
  }

  function release(self) {
    var released = self.queued;
    self.queued = [];
    return released;
  }

  var behave$c = _.does(_.implement(IEventProvider, {
    raise: raise,
    release: release
  }));

  behave$c(Events);

  function EventDispatcher(events, bus, observer) {
    this.events = events;
    this.bus = bus;
    this.observer = observer;
  }
  function eventDispatcher(events, bus, observer) {
    return new EventDispatcher(events, bus, observer);
  }

  function handle$9(self, command, next) {
    next(command);

    _.each(function (event) {
      handle$a(self.bus, event);
      $.pub(self.observer, event);
    }, release$1(self.events));
  }

  var behave$b = _.does(_.implement(IMiddleware, {
    handle: handle$9
  }));

  behave$b(EventDispatcher);

  function MessageHandler(handlers, fallback) {
    this.handlers = handlers;
    this.fallback = fallback;
  }
  function messageHandler(handlers, fallback) {
    return new MessageHandler(handlers, fallback);
  }

  function handle$8(self, command, next) {
    var type = _.get(command, "type");

    var handler = _.get(self.handlers, type, self.fallback);

    handle$a(handler, command, next);
  }

  var behave$a = _.does(_.implement(IMiddleware, {
    handle: handle$8
  }));

  behave$a(MessageHandler);

  function MessageProcessor(action) {
    this.action = action;
  }
  function messageProcessor(action) {
    return new MessageProcessor(action);
  }

  function handle$7(self, message, next) {
    self.action(message);
    next(message);
  }

  var behave$9 = _.does(_.implement(IMiddleware, {
    handle: handle$7
  }));

  behave$9(MessageProcessor);

  function Middleware(handlers) {
    this.handlers = handlers;
  }
  function middleware(handlers) {
    var _$conj, _handlers, _$apply, _ref;

    return _.doto(new Middleware(handlers || []), (_ref = _, _$apply = _ref.apply, _$conj = _.conj, _handlers = handlers, function apply(_argPlaceholder) {
      return _$apply.call(_ref, _$conj, _argPlaceholder, _handlers);
    }));
  }

  function handles$1(handle) {
    return _.doto({}, _.specify(IMiddleware, {
      handle: handle
    }));
  }

  function accepts(events, type) {
    var raise = _.partial(raise$1, events);

    return handles$1(function (x, command, next) {
      raise(_.assoc(command, "type", type));
      next(command);
    });
  }

  function raises(events, bus, callback) {
    var raise = _.partial(raise$1, events);

    return handles$1(function (x, command, next) {
      callback(bus, command, next, raise);
    });
  }

  function affects3(bus, f, react) {
    return handles$1(function (x, event, next) {
      var _event$path, _$getIn, _ref;

      var past = _.deref(bus),
          present = event.path ? _.apply(_.updateIn, past, event.path, f, event.args) : _.apply(f, past, event.args),
          scope = event.path ? (_ref = _, _$getIn = _ref.getIn, _event$path = event.path, function getIn(_argPlaceholder) {
        return _$getIn.call(_ref, _argPlaceholder, _event$path);
      }) : _.identity;

      _.reset(bus, present);

      react(bus, event, scope(present), scope(past));
      next(event);
    });
  }

  function affects2(bus, f) {
    return affects3(bus, f, _.noop);
  }

  var affects = _.overload(null, null, affects2, affects3);

  function component2(state, callback) {
    var evts = events(),
        ware = middleware(),
        observer = $.subject();
    return _.doto(bus(state, ware), function ($bus) {
      var maps = callback(_.partial(accepts, evts), _.partial(raises, evts, $bus), _.partial(affects, $bus));
      var commandMap = maps[0],
          eventMap = maps[1];
      mut.conj(ware, messageHandler(commandMap), eventDispatcher(evts, messageHandler(eventMap), observer));
    });
  }

  function component1(state) {
    return component2(state, function () {
      return [{}, {}]; //static components may lack commands that drive state change.
    });
  }

  var component = _.overload(null, component1, component2);

  function conj$2(self, handler) {
    self.handlers = _.conj(self.handlers, handler);
    self.handler = combine(self.handlers);
  }

  function combine(handlers) {
    var f = _.reduce(function (memo, handler) {
      return function (command) {
        return handle$a(handler, command, memo);
      };
    }, _.noop, _.reverse(handlers));

    function handle(x, command) {
      return f(command);
    }

    return _.doto({}, _.specify(IMiddleware, {
      handle: handle
    }));
  }

  function handle$6(self, command, next) {
    handle$a(self.handler, command, next);
  }

  var behave$8 = _.does(_.implement(mut.ITransientCollection, {
    conj: conj$2
  }), _.implement(IMiddleware, {
    handle: handle$6
  }));

  behave$8(Middleware);

  function Router(handlers) {
    this.handlers = handlers;
  }

  function router1(handlers) {
    return new Router(handlers);
  }

  function router0() {
    return router1([]);
  }

  var router = _.overload(router0, router1);

  function handler3(pred, callback, how) {
    var _pred, _how, _callback, _how2;

    return handler2((_how = how, _pred = pred, function how(_argPlaceholder) {
      return _how(_pred, _argPlaceholder);
    }), (_how2 = how, _callback = callback, function how(_argPlaceholder2) {
      return _how2(_callback, _argPlaceholder2);
    }));
  }

  function handler2(pred, callback) {
    var handler = {
      pred: pred,
      callback: callback
    };

    function handles(_, message) {
      return pred(message) ? handler : null;
    }

    function dispatch(_, message) {
      return callback(message);
    }

    return _.doto(handler, _.specify(IHandler, {
      handles: handles
    }), _.specify(IDispatch, {
      dispatch: dispatch
    }));
  }

  function handler1(callback) {
    return handler2(_.constantly(true), callback);
  }

  var handler = _.overload(null, handler1, handler2, handler3);

  function on(self, pred, callback) {
    conj$1(self, handler(pred, callback));
  }

  function handles(self, message) {
    var _message, _p$handles, _p;

    return _.detect((_p = p, _p$handles = _p.handles, _message = message, function handles(_argPlaceholder) {
      return _p$handles.call(_p, _argPlaceholder, _message);
    }), self.handlers);
  }

  function dispatch$1(self, message) {
    var handler = handles(self, message);

    if (!handler) {
      throw new Error("No suitable handler for message.");
    }

    return dispatch$3(handler, message);
  }

  function conj$1(self, handler) {
    self.handlers = _.append(self.handlers, handler);
  }

  var behave$7 = _.does(_.implement(IDispatch, {
    dispatch: dispatch$1
  }), _.implement(IHandler, {
    handles: handles
  }), _.implement($.IEvented, {
    on: on
  }), _.implement(mut.ITransientCollection, {
    conj: conj$1
  }));

  behave$7(Router);

  function MessageBus(middlewares) {
    this.middlewares = middlewares;
  }
  function messageBus(middlewares) {
    return new MessageBus(middlewares || []);
  }

  function conj(self, middleware) {
    self.middlewares = _.conj(self.middlewares, middleware);
  }

  function handle$5(self, message, next) {
    var f = _.reduce(function (memo, middleware) {
      var _middleware, _memo, _p$handle, _p;

      return _p = p, _p$handle = _p.handle, _middleware = middleware, _memo = memo, function handle(_argPlaceholder) {
        return _p$handle.call(_p, _middleware, _argPlaceholder, _memo);
      };
    }, next || _.noop, _.reverse(self.middlewares));

    f(message);
  }

  function dispatch(self, message) {
    handle$5(self, message);
  }

  var behave$6 = _.does(_.implement(mut.ITransientCollection, {
    conj: conj
  }), _.implement(IDispatch, {
    dispatch: dispatch
  }), _.implement(IMiddleware, {
    handle: handle$5
  }));

  behave$6(MessageBus);

  function Command(type, attrs) {
    this.type = type;
    this.attrs = attrs;
  }
  function constructs(Type) {
    return function message(type) {
      return function (args, options) {
        return new Type(type, Object.assign({
          args: args || []
        }, options));
      };
    };
  }
  var command = constructs(Command);

  function hash(self) {
    return imm.hash({
      type: self.type,
      attrs: self.attrs
    });
  }

  function identifier(self) {
    return self.type;
  }

  var behave$5 = _.does(_.record, _.implement(imm.IHash, {
    hash: hash
  }), _.implement(_.IIdentifiable, {
    identifier: identifier
  }));

  behave$5(Command);

  function Event(type, attrs) {
    this.type = type;
    this.attrs = attrs;
  }
  var event = constructs(Event);
  function effect(message, type) {
    var e = new Event();
    return Object.assign(e, message, {
      type: type
    });
  }
  function alter(message, type) {
    return Object.assign(_.clone(message), {
      type: type
    });
  }

  behave$5(Event);

  function EventMiddleware(emitter) {
    this.emitter = emitter;
  }
  var eventMiddleware = _.constructs(EventMiddleware);

  function handle$4(self, event, next) {
    $.pub(self.emitter, event);
    next(event);
  }

  var behave$4 = _.does(_.implement(IMiddleware, {
    handle: handle$4
  }));

  behave$4(EventMiddleware);

  function DrainEventsMiddleware(provider, eventBus) {
    this.provider = provider;
    this.eventBus = eventBus;
  }
  var drainEventsMiddleware = _.constructs(DrainEventsMiddleware);

  function handle$3(self, command, next) {
    next(command);

    _.each(function (message) {
      handle$a(self.eventBus, message, next);
    }, release$1(self.provider));
  }

  var behave$3 = _.does(_.implement(IMiddleware, {
    handle: handle$3
  }));

  behave$3(DrainEventsMiddleware);

  function HandlerMiddleware(handlers, identify, fallback) {
    this.handlers = handlers;
    this.identify = identify;
    this.fallback = fallback;
  }

  var handlerMiddleware3 = _.constructs(HandlerMiddleware);

  function handlerMiddleware2(handlers, identify) {
    return handlerMiddleware3(handlers, identify);
  }

  function handlerMiddleware1(handlers) {
    return handlerMiddleware2(handlers, _.identifier);
  }

  function handlerMiddleware0() {
    return handlerMiddleware1({});
  }

  var handlerMiddleware = _.overload(handlerMiddleware0, handlerMiddleware1, handlerMiddleware2, handlerMiddleware3);

  function assoc(self, key, handler) {
    self.handlers = _.assoc(self.handlers, key, handler);
  }

  function handle$2(self, message, next) {
    var handler = _.get(self.handlers, self.identify(message), self.fallback);

    if (handler) {
      handle$a(handler, message, next);
    } else {
      next(message);
    }
  }

  var behave$2 = _.does(_.implement(mut.ITransientAssociative, {
    assoc: assoc
  }), _.implement(IMiddleware, {
    handle: handle$2
  }));

  behave$2(HandlerMiddleware);

  function LockingMiddleware(bus, queued, handling) {
    this.bus = bus;
    this.queued = queued;
    this.handling = handling;
  }
  function lockingMiddleware(bus) {
    return new LockingMiddleware(bus, [], false);
  }

  function handle$1(self, message, next) {
    if (self.handling) {
      self.queued.push(message);
    } else {
      self.handling = true;
      next(message);
      self.handling = false;

      if (self.queued.length) {
        var _self$bus, _p$dispatch, _p;

        var queued = self.queued;
        self.queued = [];

        _.log("draining queued", queued);

        _.each((_p = p, _p$dispatch = _p.dispatch, _self$bus = self.bus, function dispatch(_argPlaceholder) {
          return _p$dispatch.call(_p, _self$bus, _argPlaceholder);
        }), queued);
      }
    }
  }

  var behave$1 = _.does(_.implement(IMiddleware, {
    handle: handle$1
  }));

  behave$1(LockingMiddleware);

  function TeeMiddleware(effect) {
    this.effect = effect;
  }
  var teeMiddleware = _.constructs(TeeMiddleware);

  function handle(self, message, next) {
    self.effect(message);
    next(message);
  }

  var behave = _.does(_.implement(IMiddleware, {
    handle: handle
  }));

  behave(TeeMiddleware);

  function defs(construct, keys) {
    return _.reduce(function (memo, key) {
      return _.assoc(memo, key, construct(key));
    }, {}, keys);
  }
  function dispatchable(Cursor) {
    //from `atomic/reactives`
    function dispatch(self, command) {
      dispatch$3(self.source, _.update(command, "path", function (path) {
        return _.apply(_.conj, self.path, path || []);
      }));
    }

    _.doto(Cursor, _.implement(IDispatch, {
      dispatch: dispatch
    }));
  }

  (function () {
    function dispatch(self, args) {
      return _.apply(self, args);
    }

    _.doto(Function, _.implement(IDispatch, {
      dispatch: dispatch
    }));
  })();

  exports.Bus = Bus;
  exports.Command = Command;
  exports.DrainEventsMiddleware = DrainEventsMiddleware;
  exports.Event = Event;
  exports.EventDispatcher = EventDispatcher;
  exports.EventMiddleware = EventMiddleware;
  exports.Events = Events;
  exports.HandlerMiddleware = HandlerMiddleware;
  exports.IDispatch = IDispatch;
  exports.IEventProvider = IEventProvider;
  exports.IHandler = IHandler;
  exports.IMiddleware = IMiddleware;
  exports.LockingMiddleware = LockingMiddleware;
  exports.MessageBus = MessageBus;
  exports.MessageHandler = MessageHandler;
  exports.MessageProcessor = MessageProcessor;
  exports.Middleware = Middleware;
  exports.Router = Router;
  exports.TeeMiddleware = TeeMiddleware;
  exports.affects = affects;
  exports.alter = alter;
  exports.bus = bus;
  exports.command = command;
  exports.component = component;
  exports.constructs = constructs;
  exports.defs = defs;
  exports.dispatch = dispatch$3;
  exports.dispatchable = dispatchable;
  exports.drainEventsMiddleware = drainEventsMiddleware;
  exports.effect = effect;
  exports.event = event;
  exports.eventDispatcher = eventDispatcher;
  exports.eventMiddleware = eventMiddleware;
  exports.events = events;
  exports.handle = handle$a;
  exports.handler = handler;
  exports.handlerMiddleware = handlerMiddleware;
  exports.handles = handles$2;
  exports.lockingMiddleware = lockingMiddleware;
  exports.messageBus = messageBus;
  exports.messageHandler = messageHandler;
  exports.messageProcessor = messageProcessor;
  exports.middleware = middleware;
  exports.raise = raise$1;
  exports.release = release$1;
  exports.router = router;
  exports.teeMiddleware = teeMiddleware;

  Object.defineProperty(exports, '__esModule', { value: true });

});
