define(['exports', 'atomic/core', 'atomic/transducers', 'symbol', 'promise', 'atomic/transients'], function (exports, _, t, _Symbol, Promise$1, mut) { 'use strict';

  var IDispatch = _.protocol({
    dispatch: null
  });

  var dispatch$3 = IDispatch.dispatch;

  function on2(self, f) {
    f(self);
  }

  function on3(self, pred, f) {
    if (pred(self)) {
      f(self);
    }
  }

  var on$2 = _.overload(null, null, on2, on3);

  var IEvented = _.protocol({
    on: on$2,
    off: null,
    trigger: null
  });

  var on$1 = IEvented.on;
  var off = IEvented.off;
  var trigger = IEvented.trigger;

  function one3(self, key, callback) {
    function cb(e) {
      off(self, key, ctx.cb);
      callback.call(this, e);
    }

    var ctx = {
      cb: cb
    };
    return on$1(self, key, cb);
  }

  function one4(self, key, selector, callback) {
    function cb(e) {
      off(self, key, ctx.cb);
      callback.call(this, e);
    }

    var ctx = {
      cb: cb
    };
    return on$1(self, key, selector, cb);
  }

  var one = _.overload(null, null, null, one3, one4);

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

  var handle$4 = _.overload(null, null, handle2, IMiddleware.handle);

  var IPublish = _.protocol({
    pub: null,
    err: null,
    complete: null,
    closed: null
  });

  var pub$4 = IPublish.pub;
  var err$3 = IPublish.err;
  var complete$3 = IPublish.complete;
  var closed$3 = IPublish.closed;

  function deref$4(self) {
    return _.deref(self.source);
  }

  function Readonly(source) {
    this.source = source;
  }
  var readonly = _.called(function readonly(source) {
    var obj = new Readonly(source);

    if (_.satisfies(_.IDeref, source)) {
      _.specify(_.IDeref, {
        deref: deref$4
      }, obj);
    }

    return obj;
  }, "`readonly` is deprecated — use `toObservable` instead.");

  var ISubscribe = _.protocol({
    sub: null,
    unsub: null,
    subscribed: null
  });

  function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$1(); }

  function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

  function _iterableToArray$1(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$2(arr); }

  function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function into2(sink, source) {
    return into3(sink, _.identity, source);
  }

  function into3(sink, xf, source) {
    return into4(readonly, sink, xf, source);
  }

  function into4(decorate, sink, xf, source) {
    var observer = _.partial(xf(pub$4), sink);

    ISubscribe.sub(source, observer);

    function dispose(_) {
      ISubscribe.unsub(source, observer);
    }

    return _.doto(decorate(sink), _.specify(_.IDisposable, {
      dispose: dispose
    }));
  }

  function sub3(source, xf, sink) {
    return ISubscribe.transducing(source, xf, sink);
  }

  function subN(source) {
    var sink = arguments[arguments.length - 1],
        xfs = _.slice(arguments, 1, arguments.length - 1);

    return sub3(source, _.comp.apply(_, _toConsumableArray$1(xfs)), sink);
  }

  function transducing(source, xf, sink) {
    return into4(_.identity, sink, xf, source);
  }

  ISubscribe.transducing = transducing; //temporarily exposed to allow feature flag override

  var into = _.overload(null, null, into2, into3, into4);
  var sub$7 = _.overload(null, null, ISubscribe.sub, sub3, subN);
  var unsub$6 = _.overload(null, null, ISubscribe.unsub);
  var subscribed$6 = ISubscribe.subscribed;

  var IRevertible = _.protocol({
    undo: null,
    redo: null,
    flush: null,
    undoable: null,
    redoable: null
  });

  var undo$1 = IRevertible.undo;
  var undoable$1 = IRevertible.undoable;
  var redo$1 = IRevertible.redo;
  var redoable$1 = IRevertible.redoable;
  var flush$1 = IRevertible.flush;

  var p = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dispatch: dispatch$3,
    on: on$1,
    off: off,
    trigger: trigger,
    one: one,
    raise: raise$1,
    release: release$1,
    handle: handle$4,
    pub: pub$4,
    err: err$3,
    complete: complete$3,
    closed: closed$3,
    into: into,
    sub: sub$7,
    unsub: unsub$6,
    subscribed: subscribed$6,
    undo: undo$1,
    undoable: undoable$1,
    redo: redo$1,
    redoable: redoable$1,
    flush: flush$1
  });

  function Observable(subscribe) {
    this.subscribe = subscribe;
  }
  function observable(subscribe) {
    return new Observable(subscribe);
  }

  function merge(self, other) {
    return observable(function (observer) {
      var _observer, _p$pub, _p;

      var handle = (_p = p, _p$pub = _p.pub, _observer = observer, function pub(_argPlaceholder) {
        return _p$pub.call(_p, _observer, _argPlaceholder);
      });
      return _.does(sub$7(self, handle), sub$7(other, handle));
    });
  }

  function reduce(self, f, init) {
    var _self, _f;

    return sub$7(init, (_f = f, _self = self, function f(_argPlaceholder2) {
      return _f(_self, _argPlaceholder2);
    }));
  }

  var imergable = _.implement(_.IMergable, {
    merge: merge
  });
  var ireduce = _.implement(_.IReduce, {
    reduce: reduce
  });

  function Subject(observers, terminated) {
    this.observers = observers;
    this.terminated = terminated;
  }
  function subject(observers) {
    return new Subject(mut["transient"](observers || []), null);
  }
  var broadcast = _.called(subject, "`broadcast` deprecated - use `subject` instead.");

  function Cell(state, observer, validate) {
    this.state = state;
    this.observer = observer;
    this.validate = validate;
  }

  function cell0() {
    return cell1(null);
  }

  function cell1(init) {
    return cell2(init, subject());
  }

  function cell2(init, observer) {
    return cell3(init, observer, null);
  }

  function cell3(init, observer, validate) {
    return new Cell(init, observer, validate);
  }

  var cell = _.overload(cell0, cell1, cell2, cell3);

  function pub$3(self, value) {
    if (value !== self.state) {
      if (!self.validate || self.validate(value)) {
        self.state = value;
        pub$4(self.observer, value);
      } else {
        throw new Error("Cell update failed - invalid value.");
      }
    }
  }

  function err$2(self, observer) {
    err$3(self.observer, observer);
  }

  function complete$2(self) {
    complete$3(self.observer);
  }

  function closed$2(self) {
    return closed$3(self.observer);
  }

  function sub$6(self, observer) {
    pub$4(observer, self.state); //to prime subscriber state

    return sub$7(self.observer, observer); //return unsubscribe fn
  }

  function unsub$5(self, observer) {
    unsub$6(self.observer, observer);
  }

  function subscribed$5(self) {
    return subscribed$6(self.observer);
  }

  function deref$3(self) {
    return self.state;
  }

  function swap$2(self, f) {
    pub$3(self, f(self.state));
  }

  function dispose$2(self) {
    _.satisfies(_.IDisposable, self.observer) && _.dispose(self.observer);
  }

  var behave$e = _.does(ireduce, imergable, _.implement(_.IDisposable, {
    dispose: dispose$2
  }), _.implement(_.IDeref, {
    deref: deref$3
  }), _.implement(_.IReset, {
    reset: pub$3
  }), _.implement(_.ISwap, {
    swap: swap$2
  }), _.implement(ISubscribe, {
    sub: sub$6,
    unsub: unsub$5,
    subscribed: subscribed$5
  }), _.implement(IPublish, {
    pub: pub$3,
    err: err$2,
    complete: complete$2,
    closed: closed$2
  }));

  behave$e(Cell);

  function deref$2(self) {
    if (subscribed$6(self) === 0) {
      //force refresh of sink state
      sub$7(self, _.noop);
      unsub$6(self, _.noop);
    }

    return _.deref(self.sink);
  }

  function AudienceDetector(sink, state) {
    this.sink = sink;
    this.state = state;
  }

  function audienceDetector2(sink, detected) {
    var init = subscribed$6(sink) === 0 ? "idle" : "active";
    var $state = cell(_.fsm(init, {
      idle: {
        activate: "active"
      },
      active: {
        deactivate: "idle"
      }
    }));
    sub$7($state, _.comp(detected, _.state));
    var result = new AudienceDetector(sink, $state);

    if (_.satisfies(_.IDeref, sink)) {
      _.specify(_.IDeref, {
        deref: deref$2
      }, result);
    }

    return result;
  }

  function audienceDetector3(sink, xf, source) {
    var observer = _.partial(xf(pub$4), sink);

    return audienceDetector2(sink, function (state) {
      var f = state === "active" ? sub$7 : unsub$6;
      f(source, observer);
    });
  }

  var audienceDetector = _.overload(null, null, audienceDetector2, audienceDetector3);

  function sub$5(self, observer) {
    if (subscribed$4(self) === 0) {
      var _$transition, _ref;

      _.swap(self.state, (_ref = _, _$transition = _ref.transition, function transition(_argPlaceholder) {
        return _$transition.call(_ref, _argPlaceholder, "activate");
      }));
    }

    sub$7(self.sink, observer);
    return _.once(function () {
      return unsub$4(self, observer);
    });
  }

  function unsub$4(self, observer) {
    unsub$6(self.sink, observer);

    if (subscribed$4(self) === 0) {
      var _$transition2, _ref2;

      _.swap(self.state, (_ref2 = _, _$transition2 = _ref2.transition, function transition(_argPlaceholder2) {
        return _$transition2.call(_ref2, _argPlaceholder2, "deactivate");
      }));
    }
  }

  function subscribed$4(self) {
    return subscribed$6(self.sink);
  }

  function dispose$1(self) {
    var _$transition3, _ref3;

    _.swap(self.state, (_ref3 = _, _$transition3 = _ref3.transition, function transition(_argPlaceholder3) {
      return _$transition3.call(_ref3, _argPlaceholder3, "deactivate");
    }));
  }

  function state(self) {
    return _.state(_.deref(self.state));
  }

  var behave$d = _.does(ireduce, imergable, _.implement(_.IDisposable, {
    dispose: dispose$1
  }), _.implement(_.IStateMachine, {
    state: state
  }), _.implement(ISubscribe, {
    sub: sub$5,
    unsub: unsub$4,
    subscribed: subscribed$4
  }));

  behave$d(AudienceDetector);

  function Bus(state, handler) {
    this.state = state;
    this.handler = handler;
  }
  function bus(state, handler) {
    return new Bus(state, handler);
  }

  function dispatch$2(self, command) {
    handle$4(self.handler, command);
  }

  function dispose(self) {
    _.satisfies(_.IDisposable, self.state) && _.dispose(self.state);
    _.satisfies(_.IDisposable, self.handler) && _.dispose(self.handler);
  }

  var behave$c = _.does(_.forward("state", ISubscribe, _.IDeref, _.IReset, _.ISwap, _.IReduce), _.implement(IDispatch, {
    dispatch: dispatch$2
  }), _.implement(_.IDisposable, {
    dispose: dispose
  }));

  behave$c(Bus);

  function Cursor(source, path, callbacks) {
    this.source = source;
    this.path = path;
    this.callbacks = callbacks;
  }
  function cursor(source, path) {
    return new Cursor(source, path, _.weakMap());
  }

  function path(self) {
    return self.path;
  }

  function deref$1(self) {
    return _.getIn(_.deref(self.source), self.path);
  }

  function reset$1(self, value) {
    _.swap(self.source, function (state) {
      return _.assocIn(state, self.path, value);
    });
  }

  function swap$1(self, f) {
    _.swap(self.source, function (state) {
      return _.updateIn(state, self.path, f);
    });
  }

  function sub$4(self, observer) {
    function observe(state) {
      pub$4(observer, _.getIn(state, self.path));
    }

    self.callbacks.set(observer, observe);
    sub$7(self.source, observe);
  }

  function unsub$3(self, observer) {
    var observe = self.callbacks.get(observer);
    unsub$6(self.source, observe);
    observe && self.callbacks["delete"](observer);
  }

  function subscribed$3(self) {
    return _.count(self.callbacks);
  }

  function dispatch$1(self, command) {
    dispatch$3(self.source, _.update(command, "path", function (path) {
      return _.apply(_.conj, self.path, path || []);
    }));
  }

  var behave$b = _.does( //_.implement(_.IDisposable, {dispose}), TODO
  _.implement(_.IPath, {
    path: path
  }), _.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(_.IReset, {
    reset: reset$1
  }), _.implement(_.ISwap, {
    swap: swap$1
  }), _.implement(IDispatch, {
    dispatch: dispatch$1
  }), _.implement(ISubscribe, {
    sub: sub$4,
    unsub: unsub$3,
    subscribed: subscribed$3
  }), _.implement(IPublish, {
    pub: reset$1
  }));

  behave$b(Cursor);

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

  var behave$a = _.does(_.implement(IEventProvider, {
    raise: raise,
    release: release
  }));

  behave$a(Events);

  function EventDispatcher(events, bus, observer) {
    this.events = events;
    this.bus = bus;
    this.observer = observer;
  }
  function eventDispatcher(events, bus, observer) {
    return new EventDispatcher(events, bus, observer);
  }

  function handle$3(self, command, next) {
    next(command);

    _.each(function (event) {
      handle$4(self.bus, event);
      pub$4(self.observer, event);
    }, release$1(self.events));
  }

  var behave$9 = _.does(_.implement(IMiddleware, {
    handle: handle$3
  }));

  behave$9(EventDispatcher);

  function Journal(pos, max, history, cell) {
    this.pos = pos;
    this.max = max;
    this.history = history;
    this.cell = cell;
  }

  function journal2(max, cell) {
    return new Journal(0, max, [_.deref(cell)], cell);
  }

  function journal1(cell) {
    return journal2(Infinity, cell);
  }

  var journal = _.overload(null, journal1, journal2);

  function deref(self) {
    return _.deref(self.cell);
  }

  function reset(self, state) {
    var history = self.pos ? self.history.slice(self.pos) : self.history;
    history.unshift(state);

    while (_.count(history) > self.max) {
      history.pop();
    }

    self.history = history;
    self.pos = 0;

    _.reset(self.cell, state);
  }

  function swap(self, f) {
    reset(self, f(_.deref(self.cell)));
  }

  function sub$3(self, observer) {
    sub$7(self.cell, observer);
  }

  function unsub$2(self, observer) {
    unsub$6(self.cell, observer);
  }

  function subscribed$2(self) {
    return subscribed$6(self.cell);
  }

  function undo(self) {
    if (undoable(self)) {
      self.pos += 1;

      _.reset(self.cell, self.history[self.pos]);
    }
  }

  function redo(self) {
    if (redoable(self)) {
      self.pos -= 1;

      _.reset(self.cell, self.history[self.pos]);
    }
  }

  function flush(self) {
    self.history = [self.history[self.pos]];
    self.pos = 0;
  }

  function undoable(self) {
    return self.pos < _.count(self.history);
  }

  function redoable(self) {
    return self.pos > 0;
  }

  var behave$8 = _.does(_.implement(_.IDeref, {
    deref: deref
  }), _.implement(_.IReset, {
    reset: reset
  }), _.implement(_.ISwap, {
    swap: swap
  }), _.implement(IRevertible, {
    undo: undo,
    redo: redo,
    flush: flush,
    undoable: undoable,
    redoable: redoable
  }), _.implement(ISubscribe, {
    sub: sub$3,
    unsub: unsub$2,
    subscribed: subscribed$2
  }));

  behave$8(Journal);

  function MessageHandler(handlers, fallback) {
    this.handlers = handlers;
    this.fallback = fallback;
  }
  function messageHandler(handlers, fallback) {
    return new MessageHandler(handlers, fallback);
  }

  function handle$2(self, command, next) {
    var type = _.get(command, "type");

    var handler = _.get(self.handlers, type, self.fallback);

    handle$4(handler, command, next);
  }

  var behave$7 = _.does(_.implement(IMiddleware, {
    handle: handle$2
  }));

  behave$7(MessageHandler);

  function MessageProcessor(action) {
    this.action = action;
  }
  function messageProcessor(action) {
    return new MessageProcessor(action);
  }

  function handle$1(self, message, next) {
    self.action(message);
    next(message);
  }

  var behave$6 = _.does(_.implement(IMiddleware, {
    handle: handle$1
  }));

  behave$6(MessageProcessor);

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
        observer = subject();
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

  function conj$1(self, handler) {
    self.handlers = _.conj(self.handlers, handler);
    self.handler = combine(self.handlers);
  }

  function combine(handlers) {
    var f = _.reduce(function (memo, handler) {
      return function (command) {
        return handle$4(handler, command, memo);
      };
    }, _.noop, _.reverse(handlers));

    function handle(x, command) {
      return f(command);
    }

    return _.doto({}, _.specify(IMiddleware, {
      handle: handle
    }));
  }

  function handle(self, command, next) {
    handle$4(self.handler, command, next);
  }

  var behave$5 = _.does(_.implement(mut.ITransientCollection, {
    conj: conj$1
  }), _.implement(IMiddleware, {
    handle: handle
  }));

  behave$5(Middleware);

  function Observer(pub, err, complete, terminated) {
    this.pub = pub;
    this.err = err;
    this.complete = complete;
    this.terminated = terminated;
  }
  function observer(pub, err, complete) {
    return new Observer(pub || _.noop, err || _.noop, complete || _.noop, null);
  }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function pipeN(source) {
    for (var _len = arguments.length, xforms = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      xforms[_key - 1] = arguments[_key];
    }

    return pipe2(source, _.comp.apply(_, xforms));
  }

  function pipe2(source, xform) {
    return observable(function (obs) {
      var step = xform(_.overload(null, _.reduced, function (memo, value) {
        pub$4(memo, value);
        return memo;
      }));
      var sink = observer(function (value) {
        var memo = step(obs, value);

        if (_.isReduced(memo)) {
          complete$3(sink);
        }
      }, function (error) {
        err$3(obs, error);
        unsub && unsub();
      }, function () {
        step(obs);
        complete$3(obs);
        unsub && unsub();
      });
      var unsub = sub$7(source, sink); //might complete before returning `unsub` fn

      if (closed$3(sink)) {
        unsub();
        return _.noop;
      }

      return unsub;
    });
  }

  var pipe = _.overload(null, _.identity, pipe2, pipeN);

  function multiplex1(source) {
    return multiplex2(source, subject());
  }

  function multiplex2(source, sink) {
    var disconnect = _.noop,
        refs = 0;
    return observable(function (observer) {
      if (refs === 0) {
        disconnect = sub$7(source, sink);
      }

      refs++;
      var unsub = sub$7(sink, observer);
      return function () {
        refs--;

        if (refs === 0) {
          disconnect();
          disconnect = _.noop;
        }

        unsub();
      };
    });
  }

  var multiplex = _.overload(null, multiplex1, multiplex2);

  function fromEvent2(el, key) {
    return observable(function (observer) {
      var _observer, _pub;

      var handler = (_pub = pub$4, _observer = observer, function pub(_argPlaceholder) {
        return _pub(_observer, _argPlaceholder);
      });
      el.addEventListener(key, handler);
      return function () {
        el.removeEventListener(key, handler);
      };
    });
  }

  function fromEvent3(el, key, selector) {
    return observable(function (observer) {
      var _observer2, _pub2;

      var handler = (_pub2 = pub$4, _observer2 = observer, function pub(_argPlaceholder2) {
        return _pub2(_observer2, _argPlaceholder2);
      });

      function delegate(e) {
        if (_.matches(e.target, selector)) {
          handler(observer, e);
        } else {
          var found = _.closest(e.target, selector);

          if (found && el.contains(found)) {
            handler(observer, Object.assign(Object.create(e), {
              target: found
            }));
          }
        }
      }

      el.addEventListener(key, delegate);
      return function () {
        el.removeEventListener(key, delegate);
      };
    });
  } //const fromEvent = _.overload(null, null, fromEvent2, fromEvent3)


  function fromEvents2(el, keys) {
    var _el, _fromEvent;

    return _.apply(_.merge, _.map((_fromEvent = fromEvent2, _el = el, function fromEvent2(_argPlaceholder3) {
      return _fromEvent(_el, _argPlaceholder3);
    }), _.split(keys, ' ')));
  }

  function fromEvents3(el, keys, selector) {
    var _el2, _selector, _fromEvent2;

    return _.apply(_.merge, _.map((_fromEvent2 = fromEvent3, _el2 = el, _selector = selector, function fromEvent3(_argPlaceholder4) {
      return _fromEvent2(_el2, _argPlaceholder4, _selector);
    }), _.split(keys, ' ')));
  }

  var fromEvent = _.overload(null, null, fromEvents2, fromEvents3);

  function seed2(init, source) {
    return _.doto(observable(function (observer) {
      var _observer3, _pub3;

      var handle = (_pub3 = pub$4, _observer3 = observer, function pub(_argPlaceholder5) {
        return _pub3(_observer3, _argPlaceholder5);
      });
      handle(init());
      return sub$7(source, handle);
    }), _.specify(_.IDeref, {
      deref: init
    })); //TODO remove after migration, this is for `sink` compatibility only
  }

  function seed1(source) {
    return seed2(_.constantly(null), source);
  } //adds an immediate value upon subscription as with cells.


  var seed = _.overload(null, seed1, seed2);
  function computes(source, f) {
    return seed(f, pipe(source, t.map(f)));
  }
  function interact(key, f, el) {
    return computes(fromEvent(el, key), function () {
      return f(el);
    });
  }
  function hash(window) {
    return computes(fromEvent(window, "hashchange"), function (e) {
      return window.location.hash;
    });
  }
  function indexed(sources) {
    return observable(function (observer) {
      var _param, _$mapIndexed, _ref;

      return _.just(sources, (_ref = _, _$mapIndexed = _ref.mapIndexed, _param = function _param(key, source) {
        return sub$7(source, function (value) {
          pub$4(observer, {
            key: key,
            value: value
          });
        });
      }, function mapIndexed(_argPlaceholder6) {
        return _$mapIndexed.call(_ref, _param, _argPlaceholder6);
      }), _.toArray, _.spread(_.does));
    });
  }

  function _currents1(sources) {
    return _currents2(sources, null);
  }

  function _currents2(sources, blank) {
    var source = indexed(sources);
    return observable(function (observer) {
      var state = _.toArray(_.take(_.count(sources), _.repeat(blank)));

      return sub$7(source, function (msg) {
        state = _.assoc(state, msg.key, msg.value);
        pub$4(observer, state);
      });
    });
  }

  var _currents = _.overload(null, _currents1, _currents2); //sources must provide an initial current value (e.g. immediately upon subscription as cells do).


  function current(sources) {
    var nil = {},
        source = _currents(sources, nil);

    return observable(function (observer) {
      var init = false;
      return sub$7(source, function (state) {
        if (init) {
          pub$4(observer, state);
        } else if (!_.includes(state, nil)) {
          init = true;
          pub$4(observer, state);
        }
      });
    });
  }
  function toggles(el, on, off, init) {
    return seed(init, _.merge(pipe(fromEvent(el, on), t.constantly(true)), pipe(fromEvent(el, off), t.constantly(false))));
  }
  function focus(el) {
    return toggles(el, "focus", "blur", function () {
      return el === el.ownerDocument.activeElement;
    });
  }
  function click(el) {
    return fromEvent(el, "click");
  }
  function hover(el) {
    return toggles(el, "mouseover", "mouseout", _.constantly(false));
  }
  function always(value) {
    return observable(function (observer) {
      pub$4(observer, value);
      complete$3(observer);
    });
  }
  function tick(interval) {
    return observable(function (observer) {
      var iv = setInterval(function () {
        pub$4(observer, new Date().getTime());
      }, interval);
      return function () {
        clearInterval(iv);
      };
    });
  }

  function map2$1(f, source) {
    return pipe(source, t.map(f), t.dedupe());
  }

  function mapN$1(f) {
    for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    return map2$1(_.spread(f), current(sources));
  }

  var calc = _.overload(null, null, map2$1, mapN$1); //TODO revert to `map` after migration.

  function then2$1(f, source) {
    var src = map2$1(f, source);
    return observable(function (observer) {
      return sub$7(src, function (value) {
        var _observer4, _pub4;

        Promise$1.resolve(value).then((_pub4 = pub$4, _observer4 = observer, function pub(_argPlaceholder7) {
          return _pub4(_observer4, _argPlaceholder7);
        }));
      });
    });
  }

  function thenN$1(f) {
    for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      sources[_key3 - 1] = arguments[_key3];
    }

    return then2$1(_.spread(f), current(sources));
  }

  var andThen = _.overload(null, null, then2$1, thenN$1); //calling this may spark sad thoughts

  function depressed(el) {
    return seed(_.constantly([]), pipe(fromEvent(el, "keydown keyup"), t.scan(function (memo, e) {
      if (e.type === "keyup") {
        var _e$key, _$notEq, _ref2;

        memo = _.filtera((_ref2 = _, _$notEq = _ref2.notEq, _e$key = e.key, function notEq(_argPlaceholder8) {
          return _$notEq.call(_ref2, _e$key, _argPlaceholder8);
        }), memo);
      } else if (!_.includes(memo, e.key)) {
        memo = _.conj(memo, e.key);
      }

      return memo;
    }, []), t.dedupe()));
  }
  function toObservable(self) {
    var f = _.satisfies(_.ICoercible, "toObservable", self);

    if (f) {
      return f(self);
    } else if (_.satisfies(ISubscribe, "sub", self)) {
      return fromSource(self);
    } else if (_.satisfies(_.ISequential, self)) {
      return fromCollection(self);
    }
  }

  function fromCollection(coll) {
    return observable(function (observer) {
      var _iterator = _createForOfIteratorHelper(coll),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          pub$4(observer, item);

          if (closed$3(observer)) {
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      complete$3(observer);
    });
  }

  function fromPromise$1(promise) {
    return observable(function (observer) {
      var _observer5, _pub5, _observer6, _err;

      promise.then((_pub5 = pub$4, _observer5 = observer, function pub(_argPlaceholder9) {
        return _pub5(_observer5, _argPlaceholder9);
      }), (_err = err$3, _observer6 = observer, function err(_argPlaceholder10) {
        return _err(_observer6, _argPlaceholder10);
      })).then(function () {
        complete$3(observer);
      });
    });
  }

  function fromSource(source) {
    var _source, _sub;

    //can be used to cover a source making it readonly
    return observable((_sub = sub$7, _source = source, function sub(_argPlaceholder11) {
      return _sub(_source, _argPlaceholder11);
    }));
  }

  _.extend(_.ICoercible, {
    toObservable: null
  });

  _.doto(Observable, _.implement(_.ICoercible, {
    toObservable: _.identity
  }));

  _.doto(Promise$1, _.implement(_.ICoercible, {
    toObservable: fromPromise$1
  }));

  function sub$2(self, observer) {
    var unsub = self.subscribe(observer) || _.noop;

    return closed$3(observer) ? (unsub(), _.noop) : unsub;
  }

  var behave$4 = _.does(ireduce, imergable, _.implement(ISubscribe, {
    sub: sub$2,
    unsub: _.noop,
    subscribed: _.constantly(1)
  })); //TODO  `unsub` and `subscribed` mock implementations are for cross compatibility and may be removed post migration

  behave$4(Observable);

  function pub$2(self, message) {
    if (!self.terminated) {
      return self.pub(message); //unusual for a command but required by transducers
    }
  }

  function err$1(self, error) {
    if (!self.terminated) {
      self.terminated = {
        how: "error",
        error: error
      };
      self.err(error);
    }
  }

  function complete$1(self) {
    if (!self.terminated) {
      self.terminated = {
        how: "complete"
      };
      self.complete();
    }
  }

  function closed$1(self) {
    return self.terminated;
  }

  var behave$3 = _.does(_.implement(IPublish, {
    pub: pub$2,
    err: err$1,
    complete: complete$1,
    closed: closed$1
  }));

  behave$3(Observer);

  function sub$1(self, observer) {
    sub$7(self.source, observer);
    return _.once(function () {
      unsub$1(self, observer);
    });
  }

  function unsub$1(self, observer) {
    unsub$6(self.source, observer);
  }

  function subscribed$1(self) {
    return subscribed$6(self.source);
  }

  var behave$2 = _.does(_.implement(ISubscribe, {
    sub: sub$1,
    unsub: unsub$1,
    subscribed: subscribed$1
  }));

  behave$2(Readonly);

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

    return _.doto(handler, _.specify(_.IHandler, {
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
    conj(self, handler(pred, callback));
  }

  function handles(self, message) {
    var _message, _$handles, _ref;

    return _.detect((_ref = _, _$handles = _ref.handles, _message = message, function handles(_argPlaceholder) {
      return _$handles.call(_ref, _argPlaceholder, _message);
    }), self.handlers);
  }

  function dispatch(self, message) {
    var handler = handles(self, message);

    if (!handler) {
      throw new Error("No suitable handler for message.");
    }

    return dispatch$3(handler, message);
  }

  function conj(self, handler) {
    self.handlers = _.append(self.handlers, handler);
  }

  var behave$1 = _.does(_.implement(IEvented, {
    on: on
  }), _.implement(IDispatch, {
    dispatch: dispatch
  }), _.implement(_.IHandler, {
    handles: handles
  }), _.implement(mut.ITransientCollection, {
    conj: conj
  }));

  behave$1(Router);

  function sub(self, observer) {
    if (!self.terminated) {
      mut.conj(self.observers, observer);
      return _.once(function () {
        unsub(self, observer);
      });
    } else {
      throw new Error("Cannot subscribe to a terminated Subject.");
    }
  }

  function unsub(self, observer) {
    mut.unconj(self.observers, observer);
  }

  function subscribed(self) {
    return _.count(self.observers);
  }

  function pub$1(self, message) {
    if (!self.terminated) {
      var _message, _p$pub, _p;

      notify(self, (_p = p, _p$pub = _p.pub, _message = message, function pub(_argPlaceholder) {
        return _p$pub.call(_p, _argPlaceholder, _message);
      }));
    }
  }

  function err(self, error) {
    if (!self.terminated) {
      var _error, _p$err, _p2;

      self.terminated = {
        how: "error",
        error: error
      };
      notify(self, (_p2 = p, _p$err = _p2.err, _error = error, function err(_argPlaceholder2) {
        return _p$err.call(_p2, _argPlaceholder2, _error);
      }));
      self.observers = null; //release references
    }
  }

  function complete(self) {
    if (!self.terminated) {
      self.terminated = {
        how: "complete"
      };
      notify(self, complete$3);
      self.observers = null; //release references
    }
  }

  function closed(self) {
    return self.terminated;
  } //copying prevents midstream changes to observers


  function notify(self, f) {
    _.each(f, _.clone(self.observers));
  }

  var behave = _.does(ireduce, imergable, _.implement(ISubscribe, {
    sub: sub,
    unsub: unsub,
    subscribed: subscribed
  }), _.implement(IPublish, {
    pub: pub$1,
    err: err,
    complete: complete,
    closed: closed
  }));

  behave(Subject);

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function then2(f, source) {
    var sink = cell(null);

    function observe(value) {
      _.fmap(Promise$1.resolve(f(value)), _.partial(pub, sink));
    }

    function dispose(self) {
      unsub$6(source, observe);
    }

    sub$7(source, observe);
    return _.doto(readonly(sink), _.specify(_.IDisposable, {
      dispose: dispose
    }));
  }

  function thenN(f) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    return then2(_.spread(f), latest(sources));
  }

  var then = _.called(_.overload(null, null, then2, thenN), "`then` is deprecated — use `andThen` and `seed` instead.");
  function collect(cell) {
    return function (value) {
      var _value, _$conj, _ref;

      //return observer
      _.swap(cell, (_ref = _, _$conj = _ref.conj, _value = value, function conj(_argPlaceholder) {
        return _$conj.call(_ref, _argPlaceholder, _value);
      }));
    };
  }

  function signal1(source) {
    return signal2(t.identity(), source);
  }

  function signal2(xf, source) {
    return signal3(xf, null, source);
  }

  function signal3(xf, init, source) {
    return signal4(audienceDetector, xf, init, source);
  }

  function signal4(into, xf, init, source) {
    return into(cell(init), xf, source);
  }

  var signal = _.called(_.overload(null, signal1, signal2, signal3, signal4), "`signal` is deprecated.");
  var fromElement = _.called(function fromElement(events, f, el) {
    return signal(t.map(function () {
      return f(el);
    }), f(el), event(el, events));
  }, "`fromElement` is deprecated — use `interact` instead.");

  function sink(source) {
    return _.satisfies(_.IDeref, source) ? cell() : subject();
  }

  function via2(xf, source) {
    return into(sink(source), xf, source);
  }

  function viaN(xf) {
    for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    return via2(_.spread(xf), latest(sources));
  }

  var via = _.called(_.overload(null, null, via2, viaN), "`via` is deprecated.");

  function connect2(source, sink) {
    return sub$7(source, sink);
  }

  function connect3(source, xform, sink) {
    return sub$7(pipe(source, xform), sink);
  }

  function connectN(source) {
    var sink = arguments[arguments.length - 1],
        xforms = _.slice(arguments, 1, arguments.length - 1);

    return sub$7(pipe.apply(void 0, [source].concat(_toConsumableArray(xforms))), sink);
  }

  var connect = _.overload(null, null, connect2, connect3, connectN); //returns `unsub` fn

  function map2(f, source) {
    return via2(_.comp(t.map(f), t.dedupe()), source);
  }

  function mapN(f) {
    for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      sources[_key3 - 1] = arguments[_key3];
    }

    return map2(_.spread(f), latest(sources));
  }

  var map = _.called(_.overload(null, null, map2, mapN), "`map` is deprecated — use `calc` instead.");
  var computed = _.called(function computed(f, source) {
    var sink = cell(f(source));

    function callback() {
      _.reset(sink, f(source));
    }

    function pub(self, value) {
      pub$4(source, value);
    }

    return _.doto(audienceDetector(sink, function (state) {
      var f = state == "active" ? sub$7 : unsub$6;
      f(source, callback);
    }), _.specify(IPublish, {
      pub: pub
    }));
  }, "`computed` is deprecated — use `computes` instead.");

  function fmap(source, f) {
    return map(f, source);
  }

  _.each(_.implement(_.IFunctor, {
    fmap: fmap
  }), [AudienceDetector, Cell, Subject, Observable]);

  function fromPromise1(promise) {
    return fromPromise2(promise, null);
  }

  function fromPromise2(promise, init) {
    var _sink, _p$pub, _p;

    var sink = cell(init);

    _.fmap(promise, (_p = p, _p$pub = _p.pub, _sink = sink, function pub(_argPlaceholder2) {
      return _p$pub.call(_p, _sink, _argPlaceholder2);
    }));

    return sink;
  }

  var fromPromise = _.called(_.overload(null, fromPromise1, fromPromise2), "`fromPromise` is deprecated — use `toObservable` and `seed` instead.");
  var join = _.called(function join(sink) {
    var _sink2, _p$pub2, _p2;

    for (var _len4 = arguments.length, sources = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      sources[_key4 - 1] = arguments[_key4];
    }

    var callback = (_p2 = p, _p$pub2 = _p2.pub, _sink2 = sink, function pub(_argPlaceholder3) {
      return _p$pub2.call(_p2, _sink2, _argPlaceholder3);
    });
    return audienceDetector(sink, function (state) {
      var _callback, _f;

      var f = state === "active" ? sub$7 : unsub$6;

      _.each((_f = f, _callback = callback, function f(_argPlaceholder4) {
        return _f(_argPlaceholder4, _callback);
      }), sources);
    });
  }, "`join` is deprecated — use `merge` instead.");
  var fixed = _.called(_.comp(readonly, cell), "`fixed` is deprecated — use `always` instead.");
  var latest = _.called(function latest(sources) {
    var sink = cell(_.mapa(_.constantly(null), sources));

    var fs = _.memoize(function (idx) {
      return function (value) {
        var _idx, _value2, _$assoc, _ref2;

        _.swap(sink, (_ref2 = _, _$assoc = _ref2.assoc, _idx = idx, _value2 = value, function assoc(_argPlaceholder5) {
          return _$assoc.call(_ref2, _argPlaceholder5, _idx, _value2);
        }));
      };
    }, _.str);

    return audienceDetector(sink, function (state) {
      var f = state === "active" ? sub$7 : unsub$6;

      _.doall(_.mapIndexed(function (idx, source) {
        f(source, fs(idx));
      }, sources));
    });
  }, "`latest` is deprecated — use `current` instead."); //TODO after migration revert to `latest`

  function hist2(size, source) {
    var sink = cell([]);
    var history = [];
    sub$7(source, function (value) {
      history = _.slice(history);
      history.unshift(value);

      if (history.length > size) {
        history.pop();
      }

      pub$4(sink, history);
    });
    return sink;
  }

  var hist = _.called(_.overload(null, _.partial(hist2, 2), hist2), "`hist` is deprecated — use `hist` transducer instead.");

  function event2(el, key) {
    var sink = subject(),
        callback = _.partial(pub$4, sink);

    return audienceDetector(sink, function (status) {
      var f = status === "active" ? on$1 : off;
      f(el, key, callback);
    });
  }

  function event3(el, key, selector) {
    var sink = subject(),
        callback = _.partial(pub$4, sink);

    return audienceDetector(sink, function (status) {
      if (status === "active") {
        on$1(el, key, selector, callback);
      } else {
        off(el, key, callback);
      }
    });
  }

  var event = _.called(_.overload(null, null, event2, event3), "`event` deprecated - use `fromEvent` instead."); //enforce sequential nature of operations

  function isolate(f) {
    //TODO treat operations as promises
    var queue = [];
    return function () {
      var ready = queue.length === 0;
      queue.push(arguments);

      if (ready) {
        while (queue.length) {
          var args = _.first(queue);

          try {
            f.apply(null, args);
            trigger(args[0], "mutate", {
              bubbles: true
            });
          } finally {
            queue.shift();
          }
        }
      }
    };
  }

  function mutate3(self, state, f) {
    sub$7(state, _.partial(isolate(f), self));
    return self;
  }

  function mutate2(state, f) {
    var _state, _f2, _mutate;

    return _mutate = mutate3, _state = state, _f2 = f, function mutate3(_argPlaceholder6) {
      return _mutate(_argPlaceholder6, _state, _f2);
    };
  }

  var mutate = _.called(_.overload(null, null, mutate2, mutate3), "`mutate` is deprecated — use `render` instead.");

  function render3(el, obs, f) {
    return sub$7(obs, t.isolate(), function (state) {
      f(el, state);
      trigger(el, "mutate", {
        bubbles: true
      }); //TODO rename
    });
  }

  function render2(state, f) {
    var _state2, _f3, _render;

    return _render = render3, _state2 = state, _f3 = f, function render3(_argPlaceholder7) {
      return _render(_argPlaceholder7, _state2, _f3);
    };
  }

  var render = _.overload(null, null, render2, render3);

  function renderDiff3(el, obs, f) {
    return sub$7(obs, t.isolate(), t.hist(2), function (history) {
      var args = [el].concat(history);
      f.apply(this, args); //overload arity 2 & 3 for initial and diff rendering

      trigger(el, "mutate", {
        bubbles: true
      }); //TODO rename
    });
  }

  function renderDiff2(state, f) {
    var _state3, _f4, _renderDiff;

    return _renderDiff = renderDiff3, _state3 = state, _f4 = f, function renderDiff3(_argPlaceholder8) {
      return _renderDiff(_argPlaceholder8, _state3, _f4);
    };
  } //TODO replace render after migration


  var renderDiff = _.overload(null, null, renderDiff2, renderDiff3);

  (function () {
    function dispatch(self, args) {
      return _.apply(self, args);
    }

    function pub(self, msg) {
      self(msg);
    }

    _.doto(Function, ireduce, //makes fns work as observers like `cell`, e.g. `$.connect($.tick(3000), _.see("foo"))`
    _.implement(IPublish, {
      pub: pub,
      err: _.noop,
      complete: _.noop,
      closed: _.noop
    }), _.implement(IDispatch, {
      dispatch: dispatch
    }));
  })();

  exports.AudienceDetector = AudienceDetector;
  exports.Bus = Bus;
  exports.Cell = Cell;
  exports.Cursor = Cursor;
  exports.EventDispatcher = EventDispatcher;
  exports.Events = Events;
  exports.IDispatch = IDispatch;
  exports.IEventProvider = IEventProvider;
  exports.IEvented = IEvented;
  exports.IMiddleware = IMiddleware;
  exports.IPublish = IPublish;
  exports.IRevertible = IRevertible;
  exports.ISubscribe = ISubscribe;
  exports.Journal = Journal;
  exports.MessageHandler = MessageHandler;
  exports.MessageProcessor = MessageProcessor;
  exports.Middleware = Middleware;
  exports.Observable = Observable;
  exports.Observer = Observer;
  exports.Readonly = Readonly;
  exports.Router = Router;
  exports.Subject = Subject;
  exports.affects = affects;
  exports.always = always;
  exports.andThen = andThen;
  exports.audienceDetector = audienceDetector;
  exports.broadcast = broadcast;
  exports.bus = bus;
  exports.calc = calc;
  exports.cell = cell;
  exports.click = click;
  exports.closed = closed$3;
  exports.collect = collect;
  exports.complete = complete$3;
  exports.component = component;
  exports.computed = computed;
  exports.computes = computes;
  exports.connect = connect;
  exports.current = current;
  exports.cursor = cursor;
  exports.depressed = depressed;
  exports.dispatch = dispatch$3;
  exports.err = err$3;
  exports.event = event;
  exports.eventDispatcher = eventDispatcher;
  exports.events = events;
  exports.fixed = fixed;
  exports.flush = flush$1;
  exports.focus = focus;
  exports.fromElement = fromElement;
  exports.fromEvent = fromEvent;
  exports.fromPromise = fromPromise;
  exports.handle = handle$4;
  exports.handler = handler;
  exports.hash = hash;
  exports.hist = hist;
  exports.hover = hover;
  exports.indexed = indexed;
  exports.interact = interact;
  exports.into = into;
  exports.join = join;
  exports.journal = journal;
  exports.latest = latest;
  exports.map = map;
  exports.messageHandler = messageHandler;
  exports.messageProcessor = messageProcessor;
  exports.middleware = middleware;
  exports.multiplex = multiplex;
  exports.mutate = mutate;
  exports.observable = observable;
  exports.observer = observer;
  exports.off = off;
  exports.on = on$1;
  exports.one = one;
  exports.pipe = pipe;
  exports.pub = pub$4;
  exports.raise = raise$1;
  exports.readonly = readonly;
  exports.redo = redo$1;
  exports.redoable = redoable$1;
  exports.release = release$1;
  exports.render = render;
  exports.renderDiff = renderDiff;
  exports.router = router;
  exports.seed = seed;
  exports.signal = signal;
  exports.sub = sub$7;
  exports.subject = subject;
  exports.subscribed = subscribed$6;
  exports.then = then;
  exports.then2 = then2;
  exports.tick = tick;
  exports.toObservable = toObservable;
  exports.toggles = toggles;
  exports.trigger = trigger;
  exports.undo = undo$1;
  exports.undoable = undoable$1;
  exports.unsub = unsub$6;
  exports.via = via;

  Object.defineProperty(exports, '__esModule', { value: true });

});
