define(['exports', 'symbol', 'promise', 'weak-map', 'set'], function (exports, _Symbol, Promise$1, WeakMap, Set$1) { 'use strict';

  function _toConsumableArray$3(arr) { return _arrayWithoutHoles$3(arr) || _iterableToArray$3(arr) || _unsupportedIterableToArray$a(arr) || _nonIterableSpread$3(); }

  function _nonIterableSpread$3() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray$3(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles$3(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$a(arr); }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$a(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$a(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$a(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$a(o, minLen); }

  function _arrayLikeToArray$a(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }
  var unbind = Function.call.bind(Function.bind, Function.call);
  var slice = unbind(Array.prototype.slice);
  var indexOf = unbind(Array.prototype.indexOf);
  var log = console.log.bind(console);
  var warn = console.warn.bind(console);
  var info = console.info.bind(console);
  var debug = console.debug.bind(console);
  function isFunction(f) {
    return typeof f === "function";
  }
  function isSymbol(self) {
    return _typeof$3(self) === "symbol";
  }
  function isString(self) {
    return typeof self === "string";
  }
  function noop() {}
  function complement(f) {
    return function () {
      return !f.apply(this, arguments);
    };
  }
  function invokes(self, method) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return self[method].apply(self, args);
  }
  function comp() {
    var fs = arguments,
        start = fs.length - 2,
        f = fs[fs.length - 1];
    return function () {
      var memo = f.apply(this, arguments);

      for (var i = start; i > -1; i--) {
        var _f = fs[i];
        memo = _f.call(this, memo);
      }

      return memo;
    };
  }
  function pipe(f) {
    for (var _len2 = arguments.length, fs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      fs[_key2 - 1] = arguments[_key2];
    }

    return arguments.length ? function () {
      var memo = f.apply(this, arguments);

      for (var i = 0; i < fs.length; i++) {
        var _f2 = fs[i];
        memo = _f2.call(this, memo);
      }

      return memo;
    } : identity;
  }
  function overload() {
    var fs = arguments,
        fallback = fs[fs.length - 1];
    return function () {
      var f = fs[arguments.length] || (arguments.length >= fs.length ? fallback : null);
      return f.apply(this, arguments);
    };
  }
  function handle() {
    var handlers = slice(arguments, 0, arguments.length - 1),
        fallback = arguments[arguments.length - 1];
    return function () {
      var _iterator = _createForOfIteratorHelper(handlers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var handler = _step.value;
          var check = handler[0];

          if (check.apply(this, arguments)) {
            var fn = handler[1];
            return fn.apply(this, arguments);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return fallback.apply(this, arguments);
    };
  }
  function assume(pred, obj, f) {
    return handle([pred, f], partial(f, obj));
  }
  function subj(f, len) {
    //subjective
    var length = len || f.length;
    return function () {
      for (var _len3 = arguments.length, ys = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        ys[_key3] = arguments[_key3];
      }

      return ys.length >= length ? f.apply(null, ys) : function () {
        for (var _len4 = arguments.length, xs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          xs[_key4] = arguments[_key4];
        }

        return f.apply(null, xs.concat(ys));
      };
    };
  }
  function obj(f, len) {
    //objective
    var length = len || f.length;
    return function () {
      for (var _len5 = arguments.length, xs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        xs[_key5] = arguments[_key5];
      }

      return xs.length >= length ? f.apply(null, xs) : function () {
        for (var _len6 = arguments.length, ys = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          ys[_key6] = arguments[_key6];
        }

        return f.apply(null, xs.concat(ys));
      };
    };
  }

  function curry1(f) {
    return curry2(f, f.length);
  }

  function curry2(f, minimum) {
    return function () {
      var applied = arguments.length ? slice(arguments) : [undefined]; //each invocation assumes advancement

      if (applied.length >= minimum) {
        return f.apply(this, applied);
      } else {
        return curry2(function () {
          return f.apply(this, applied.concat(slice(arguments)));
        }, minimum - applied.length);
      }
    };
  }

  var curry = overload(null, curry1, curry2);
  var placeholder = {};
  function plug(f) {
    //apply placeholders and, optionally, values returning a partially applied function which is executed when all placeholders are supplied.
    var xs = slice(arguments, 1),
        n = xs.length;
    return xs.indexOf(placeholder) < 0 ? f.apply(null, xs) : function () {
      var ys = slice(arguments),
          zs = [];

      for (var i = 0; i < n; i++) {
        var x = xs[i];
        zs.push(x === placeholder && ys.length ? ys.shift() : x);
      }

      return plug.apply(null, [f].concat(zs).concat(ys));
    };
  }
  function partial(f) {
    for (var _len7 = arguments.length, applied = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      applied[_key7 - 1] = arguments[_key7];
    }

    return function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      return f.apply(this, applied.concat(args));
    };
  }
  function partly(f) {
    return partial(plug, f);
  }
  function deferring(f) {
    return function () {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      return partial.apply(void 0, [f].concat(args));
    };
  }
  function factory(f) {
    for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      args[_key10 - 1] = arguments[_key10];
    }

    return deferring(partial.apply(void 0, [f].concat(args)));
  }
  function identity(x) {
    return x;
  }
  function constantly(x) {
    return function () {
      return x;
    };
  }
  function doto(obj) {
    var len = arguments.length <= 1 ? 0 : arguments.length - 1;

    for (var i = 0; i < len; i++) {
      var effect = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
      effect(obj);
    }

    return obj;
  }
  function does() {
    for (var _len11 = arguments.length, effects = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      effects[_key11] = arguments[_key11];
    }

    var len = effects.length;
    return function doing() {
      for (var i = 0; i < len; i++) {
        var effect = effects[i];
        effect.apply(void 0, arguments);
      }
    };
  }

  function is1(constructor) {
    return function (self) {
      return is2(self, constructor);
    };
  }

  function is2(self, constructor) {
    return self != null && self.constructor === constructor;
  }

  var is = overload(null, is1, is2);
  function isInstance(self, constructor) {
    return self instanceof constructor;
  }
  var ako = isInstance;
  function kin(self, other) {
    return other != null && self != null && other.constructor === self.constructor;
  }
  function unspread(f) {
    return function () {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      return f(args);
    };
  }
  function once(f) {
    var pending = {};
    var result = pending;
    return function () {
      if (result === pending) {
        result = f.apply(void 0, arguments);
      }

      return result;
    };
  }
  function execute(f) {
    for (var _len13 = arguments.length, args = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
      args[_key13 - 1] = arguments[_key13];
    }

    return f.apply(this, args);
  }
  function applying() {
    for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      args[_key14] = arguments[_key14];
    }

    return function (f) {
      return f.apply(this, args);
    };
  }
  function constructs(Type) {
    return function () {
      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }

      return new (Function.prototype.bind.apply(Type, [null].concat(args)))();
    };
  }

  function branch3(pred, yes, no) {
    return function () {
      return pred.apply(void 0, arguments) ? yes.apply(void 0, arguments) : no.apply(void 0, arguments);
    };
  }

  function branchN(pred, f) {
    for (var _len16 = arguments.length, fs = new Array(_len16 > 2 ? _len16 - 2 : 0), _key16 = 2; _key16 < _len16; _key16++) {
      fs[_key16 - 2] = arguments[_key16];
    }

    return function () {
      return pred.apply(void 0, arguments) ? f.apply(void 0, arguments) : branch.apply(void 0, fs).apply(void 0, arguments);
    };
  }

  var branch = overload(null, null, null, branch3, branchN);

  function guard1(pred) {
    return guard2(pred, identity);
  }

  function guard2(pred, f) {
    return branch3(pred, f, noop);
  }

  var guard = overload(null, guard1, guard2);

  function memoize1(f) {
    return memoize2(f, function () {
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }

      return JSON.stringify(args);
    });
  }

  function memoize2(f, hash) {
    var cache = {};
    return function () {
      var key = hash.apply(this, arguments);

      if (cache.hasOwnProperty(key)) {
        return cache[key];
      } else {
        var result = f.apply(this, arguments);
        cache[key] = result;
        return result;
      }
    };
  }

  var memoize = overload(null, memoize1, memoize2);
  function isNative(f) {
    return /\{\s*\[native code\]\s*\}/.test('' + f);
  }

  function toggles4(on, off, want, self) {
    return want(self) ? on(self) : off(self);
  }

  function toggles5(on, off, _, self, want) {
    return want ? on(self) : off(self);
  }

  var toggles = overload(null, null, null, null, toggles4, toggles5);
  function detach(method) {
    return function (obj) {
      for (var _len18 = arguments.length, args = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
        args[_key18 - 1] = arguments[_key18];
      }

      return obj[method].apply(obj, args);
    };
  }
  function attach(f) {
    return function () {
      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
      }

      return f.apply(null, [this].concat(args));
    };
  }

  function trampoline1(f) {
    var g = f();

    while (typeof g === "function") {
      g = g();
    }

    return g;
  }

  function trampolineN(f) {
    for (var _len20 = arguments.length, args = new Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
      args[_key20 - 1] = arguments[_key20];
    }

    return trampoline1(function () {
      return f.apply(void 0, args);
    });
  }

  var trampoline = overload(null, trampoline1, trampolineN);
  function pre(f, pred) {
    return function () {
      if (!pred.apply(this, arguments)) {
        throw new TypeError("Failed pre-condition.");
      }

      return f.apply(this, arguments);
    };
  }
  function post(f, pred) {
    return function () {
      var result = f.apply(this, arguments);

      if (!pred(result)) {
        throw new TypeError("Failed post-condition.");
      }

      return result;
    };
  }

  function called4(fn, message, context, log) {
    return function () {
      var meta = Object.assign({}, context, {
        fn: fn,
        arguments: arguments
      });
      log(message, meta);
      return meta.results = fn.apply(this, arguments);
    };
  }

  function called3(fn, message, context) {
    return called4(fn, message, context, warn);
  }

  function called2(fn, message) {
    return called3(fn, message, {});
  }

  var called = overload(null, null, called2, called3, called4);
  function nullary(f) {
    return function () {
      return f();
    };
  }
  function unary(f) {
    return function (a) {
      return f(a);
    };
  }
  function binary(f) {
    return function (a, b) {
      return f(a, b);
    };
  }
  function ternary(f) {
    return function (a, b, c) {
      return f(a, b, c);
    };
  }
  function quaternary(f) {
    return function (a, b, c, d) {
      return f(a, b, c, d);
    };
  }
  function nary(f, length) {
    return function () {
      return f.apply(void 0, _toConsumableArray$3(slice(arguments, 0, length)));
    };
  }
  function arity(f, length) {
    return ([nullary, unary, binary, ternary, quaternary][length] || nary)(f, length);
  }
  function fold(f, init, xs) {
    var memo = init,
        to = xs.length - 1,
        r = {};

    for (var i = 0; i <= to; i++) {
      if (memo === r) break;
      memo = f(memo, xs[i], function (reduced) {
        return r = reduced;
      });
    }

    return memo;
  }
  function foldkv(f, init, xs) {
    var memo = init,
        len = xs.length,
        r = {};

    for (var i = 0; i < len; i++) {
      if (memo === r) break;
      memo = f(memo, i, xs[i], function (reduced) {
        return r = reduced;
      });
    }

    return memo;
  }
  function signature() {
    for (var _len21 = arguments.length, preds = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
      preds[_key21] = arguments[_key21];
    }

    return function () {
      for (var _len22 = arguments.length, values = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
        values[_key22] = arguments[_key22];
      }

      return foldkv(function (memo, idx, pred, reduced) {
        return memo ? !pred || pred(values[idx]) : reduced(memo);
      }, preds.length === values.length, preds);
    };
  }
  function signatureHead() {
    for (var _len23 = arguments.length, preds = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
      preds[_key23] = arguments[_key23];
    }

    return function () {
      for (var _len24 = arguments.length, values = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
        values[_key24] = arguments[_key24];
      }

      return foldkv(function (memo, idx, value, reduced) {
        var pred = preds[idx];
        return memo ? !pred || pred(value) : reduced(memo);
      }, true, values);
    };
  }
  function and() {
    for (var _len25 = arguments.length, preds = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
      preds[_key25] = arguments[_key25];
    }

    return function () {
      for (var _len26 = arguments.length, args = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
        args[_key26] = arguments[_key26];
      }

      return fold(function (memo, pred, reduced) {
        return memo ? pred.apply(void 0, args) : reduced(memo);
      }, true, preds);
    };
  }
  function or() {
    for (var _len27 = arguments.length, preds = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
      preds[_key27] = arguments[_key27];
    }

    return function () {
      for (var _len28 = arguments.length, args = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
        args[_key28] = arguments[_key28];
      }

      return fold(function (memo, pred, reduced) {
        return memo ? reduced(memo) : pred.apply(void 0, args);
      }, false, preds);
    };
  }
  function both(memo, value) {
    return memo && value;
  }
  function either(memo, value) {
    return memo || value;
  }
  function isIdentical(x, y) {
    return x === y; //TODO Object.is?
  }
  function everyPred() {
    for (var _len29 = arguments.length, preds = new Array(_len29), _key29 = 0; _key29 < _len29; _key29++) {
      preds[_key29] = arguments[_key29];
    }

    return function () {
      return fold(function (memo, arg) {
        return fold(function (memo, pred, reduced) {
          var result = memo && pred(arg);
          return result ? result : reduced(result);
        }, memo, preds);
      }, true, slice(arguments));
    };
  }

  function someFn1(p) {
    function f1(x) {
      return p(x);
    }

    function f2(x, y) {
      return p(x) || p(y);
    }

    function f3(x, y, z) {
      return p(x) || p(y) || p(z);
    }

    function fn(x, y, z) {
      for (var _len30 = arguments.length, args = new Array(_len30 > 3 ? _len30 - 3 : 0), _key30 = 3; _key30 < _len30; _key30++) {
        args[_key30 - 3] = arguments[_key30];
      }

      return f3(x, y, z) || some(p, args);
    }

    return overload(constantly(null), f1, f2, f3, fn);
  }

  function someFn2(p1, p2) {
    function f1(x) {
      return p1(x) || p2(x);
    }

    function f2(x, y) {
      return p1(x) || p1(y) || p2(x) || p2(y);
    }

    function f3(x, y, z) {
      return p1(x) || p1(y) || p1(z) || p2(x) || p2(y) || p2(z);
    }

    function fn(x, y, z) {
      for (var _len31 = arguments.length, args = new Array(_len31 > 3 ? _len31 - 3 : 0), _key31 = 3; _key31 < _len31; _key31++) {
        args[_key31 - 3] = arguments[_key31];
      }

      return f3(x, y, z) || some(or(p1, p2), args);
    }

    return overload(constantly(null), f1, f2, f3, fn);
  }

  function someFnN() {
    for (var _len32 = arguments.length, ps = new Array(_len32), _key32 = 0; _key32 < _len32; _key32++) {
      ps[_key32] = arguments[_key32];
    }

    function fn() {
      for (var _len33 = arguments.length, args = new Array(_len33), _key33 = 0; _key33 < _len33; _key33++) {
        args[_key33] = arguments[_key33];
      }

      return some(or.apply(void 0, ps), args);
    }

    return overload(constantly(null), fn);
  }

  var someFn = overload(null, someFn1, someFn2, someFnN);

  function folding1(f) {
    return folding2(f, identity);
  }

  function folding2(f, order) {
    return function (x) {
      for (var _len34 = arguments.length, xs = new Array(_len34 > 1 ? _len34 - 1 : 0), _key34 = 1; _key34 < _len34; _key34++) {
        xs[_key34 - 1] = arguments[_key34];
      }

      return fold(f, x, order(xs));
    };
  }

  var folding = overload(null, folding1, folding2);
  var all = overload(null, identity, both, folding1(both));
  var any = overload(null, identity, either, folding1(either));
  function everyPair(pred, xs) {
    var every = xs.length > 0;

    while (every && xs.length > 1) {
      every = pred(xs[0], xs[1]);
      xs = slice(xs, 1);
    }

    return every;
  }

  function Nil() {}
  function isNil(x) {
    return x == null;
  }
  function isSome(x) {
    return x != null;
  }
  function nil() {
    return null;
  }
  Object.defineProperty(Nil, _Symbol.hasInstance, {
    value: isNil
  });

  var TEMPLATE = _Symbol("@protocol-template"),
      INDEX = _Symbol("@protocol-index"),
      MISSING = _Symbol("@protocol-missing");

  function Protocol(template, index) {
    this[INDEX] = index;
    this[TEMPLATE] = template;
  }
  function protocol(template) {
    var p = new Protocol({}, {});
    p.extend(template);
    return p;
  }

  Protocol.prototype.extend = function (template) {
    for (var method in template) {
      this[method] = this.dispatch(method);
    }

    Object.assign(this[TEMPLATE], template);
  };

  Protocol.prototype.dispatch = function (method) {
    var protocol = this;
    return function (self) {
      var f = satisfies2.call(protocol, method, self);

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!f) {
        throw new ProtocolLookupError(protocol, method, self, args);
      }

      return f.apply(null, [self].concat(args));
    };
  };

  Protocol.prototype.generate = function () {
    var index = this[INDEX];
    return function (method) {
      var sym = index[method] || _Symbol(method);

      index[method] = sym;
      return sym;
    };
  };

  Protocol.prototype.keys = function () {
    return Object.keys(this[TEMPLATE]);
  };

  function addMeta(target, key, value) {
    try {
      Object.defineProperty(target, key, {
        //unsupported on some objects like Location
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
      });
    } catch (ex) {
      target[key] = value;
    }
  }

  function specify1(behavior) {
    var protocol = this;
    return function (target) {
      specify2.call(protocol, behavior, target);
    };
  }

  function specify2(behavior, target) {
    if (!this) {
      throw new Error("Protocol not specified.");
    }

    if (!behavior) {
      throw new Error("Behavior not specified.");
    }

    if (!target) {
      throw new Error("Subject not specified.");
    }

    var keys = this.generate();
    addMeta(target, keys("__marker__"), this);

    for (var method in behavior) {
      addMeta(target, keys(method), behavior[method]);
    }
  }

  Protocol.prototype.specify = overload(null, specify1, specify2);

  function unspecify1(behavior) {
    var protocol = this;
    return function (target) {
      unspecify2.call(protocol, behavior, target);
    };
  }

  function unspecify2(behavior, target) {
    var keys = this.generate();
    addMeta(target, keys("__marker__"), undefined);

    for (var method in behavior) {
      addMeta(target, keys(method), undefined);
    }
  }

  Protocol.prototype.unspecify = overload(null, unspecify1, unspecify2);
  function implement0() {
    return implement1.call(this, {}); //marker interface
  }

  function implement1(obj) {
    var behavior = obj.behaves ? obj.behaves(this) : obj;

    if (obj.behaves && !behavior) {
      throw new Error("Unable to borrow behavior.");
    }

    return Object.assign(implement2.bind(this, behavior), {
      protocol: this,
      behavior: behavior
    });
  }

  function implement2(behavior, target) {
    var tgt = target.prototype;

    if (tgt.constructor === Object) {
      tgt = Object;
    }

    specify2.call(this, behavior, tgt);
  }

  Protocol.prototype.implement = overload(implement0, implement1, implement2);

  function satisfies0() {
    return this.satisfies.bind(this);
  }

  function satisfies1(obj) {
    var target = obj == null ? new Nil() : obj,
        key = this[INDEX]["__marker__"] || MISSING;
    return target[key] || (target.constructor === Object ? target.constructor[key] : null);
  } //Everything inherits from Object.  The behaviors added to Object target only literals (e.g. `{}`) not everything!


  function satisfies2(method, obj) {
    var target = obj == null ? new Nil() : obj,
        key = this[INDEX][method] || MISSING;
    return target[key] || (target.constructor === Object ? target.constructor[key] : null) || this[TEMPLATE][method];
  }

  Protocol.prototype.satisfies = overload(satisfies0, satisfies1, satisfies2);
  function ProtocolLookupError(protocol, method, subject, args) {
    this.protocol = protocol;
    this.method = method;
    this.subject = subject;
    this.args = args;
  }
  ProtocolLookupError.prototype = new Error();

  ProtocolLookupError.prototype.toString = function () {
    return "Protocol lookup for ".concat(this.method, " failed.");
  };

  var extend = unbind(Protocol.prototype.extend);
  var satisfies = unbind(Protocol.prototype.satisfies);
  var specify = unbind(Protocol.prototype.specify);
  var unspecify = unbind(Protocol.prototype.unspecify);
  var implement = unbind(Protocol.prototype.implement);
  function reifiable(properties) {
    function Reifiable(properties) {
      Object.assign(this, properties);
    }

    return new Reifiable(properties || {});
  }
  function behaves(behaviors, env) {
    for (var key in behaviors) {
      if (key in env) {
        var type = env[key],
            behave = behaviors[key];
        log("extending behavior of ".concat(key));
        behave(type);
      }
    }
  }

  var IAddable = protocol({
    add: null
  });

  var IAppendable = protocol({
    append: null
  });

  var IAssociative = protocol({
    assoc: null,
    contains: null
  });

  var blank$5 = constantly(false);
  var IBlankable = protocol({
    blank: blank$5
  });

  var IBounds = protocol({
    start: null,
    end: null
  });

  var IChainable = protocol({
    chain: null
  });

  function clone$6(self) {
    return Object.assign(Object.create(self.constructor.prototype), self);
  }

  var IClonable = protocol({
    clone: clone$6
  });

  var ICoercible = protocol({
    toArray: null,
    toObject: null,
    toPromise: null,
    toDuration: null
  });

  var ICollection = protocol({
    conj: null,
    unconj: null
  });

  var ICompactible = protocol({
    compact: null
  });

  function compare$7(x, y) {
    return x > y ? 1 : x < y ? -1 : 0;
  }

  var IComparable = protocol({
    compare: compare$7
  });

  var IMultipliable = protocol({
    mult: null
  });

  var IReduce = protocol({
    reduce: null
  });

  function reduce2$1(f, coll) {
    return reduce3$1(f, f(), coll);
  }

  function reduce3$1(f, init, coll) {
    return IReduce.reduce(coll, f, init);
  }

  var reduce$f = overload(null, null, reduce2$1, reduce3$1);

  function reducing1(f) {
    return reducing2(f, identity);
  }

  function reducing2(f, order) {
    return function (x) {
      for (var _len = arguments.length, xs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        xs[_key - 1] = arguments[_key];
      }

      return reduce3$1(f, x, order(xs));
    };
  }

  var reducing = overload(null, reducing1, reducing2);

  var mult$2 = overload(constantly(1), identity, IMultipliable.mult, reducing(IMultipliable.mult));

  function inverse$4(self) {
    return IMultipliable.mult(self, -1);
  }

  var IInverse = protocol({
    inverse: inverse$4
  });

  var ICounted = protocol({
    count: null
  });

  var IDeref = protocol({
    deref: null
  });

  var IDisposable = protocol({
    dispose: null
  });

  var IDivisible = protocol({
    divide: null
  });

  var IEmptyableCollection = protocol({
    empty: null
  });

  function equiv$a(x, y) {
    return x === y;
  }

  var IEquiv = protocol({
    equiv: equiv$a
  });

  var IFind = protocol({
    find: null
  });

  var IFn = protocol({
    invoke: null
  });

  function fork$9(self, reject, resolve) {
    return resolve(self);
  }

  var IForkable = protocol({
    fork: fork$9
  });

  function fmap$c(self, f) {
    return f(self);
  }

  var IFunctor = protocol({
    fmap: fmap$c
  });

  var IHandler = protocol({
    handles: null
  });

  var IHierarchy = protocol({
    root: null,
    parent: null,
    parents: null,
    closest: null,
    children: null,
    descendants: null,
    siblings: null,
    nextSibling: null,
    nextSiblings: null,
    prevSibling: null,
    prevSiblings: null
  });

  var IIdentifiable = protocol({
    identifier: null //machine-friendly name (lowercase, no embedded spaces) offering reasonable uniqueness within a context

  });

  var IInclusive = protocol({
    includes: null
  });

  var IIndexed = protocol({
    nth: null,
    idx: null
  });

  var IInsertable = protocol({
    before: null,
    after: null
  });

  var IKVReduce = protocol({
    reducekv: null
  });

  function lookup$c(self, key) {
    return self && self[key];
  }

  var ILookup = protocol({
    lookup: lookup$c
  });

  var IMap = protocol({
    dissoc: null,
    keys: null,
    vals: null
  });

  var IMapEntry = protocol({
    key: null,
    val: null
  });

  var IMatchable = protocol({
    matches: null
  });

  var toArray$7 = ICoercible.toArray;
  var toObject$3 = ICoercible.toObject;
  var toPromise = ICoercible.toPromise;
  var toDuration$1 = ICoercible.toDuration;

  function reducekv2(f, coll) {
    return IKVReduce.reducekv(coll, f, f());
  }
  function reducekv3(f, init, coll) {
    return IKVReduce.reducekv(coll, f, init);
  }
  var reducekv$b = overload(null, null, reducekv2, reducekv3);

  var ISeq = protocol({
    first: null,
    rest: null
  });

  var first$d = ISeq.first;
  var rest$d = ISeq.rest;
  var second$2 = comp(ISeq.first, ISeq.rest);

  function get(self, key, notFound) {
    var found = ILookup.lookup(self, key);
    return found == null ? notFound == null ? null : notFound : found;
  }
  function getIn(self, keys, notFound) {
    var found = reduce$f(get, self, keys);
    return found == null ? notFound == null ? null : notFound : found;
  }

  function assocN(self, key, value) {
    var instance = IAssociative.assoc(self, key, value);

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    return args.length > 0 ? assocN.apply(void 0, [instance].concat(args)) : instance;
  }

  var assoc$a = overload(null, null, null, IAssociative.assoc, assocN);
  function assocIn(self, keys, value) {
    var key = keys[0];

    switch (keys.length) {
      case 0:
        return self;

      case 1:
        return IAssociative.assoc(self, key, value);

      default:
        return IAssociative.assoc(self, key, assocIn(get(self, key), toArray$7(rest$d(keys)), value));
    }
  }

  function update3(self, key, f) {
    return IAssociative.assoc(self, key, f(get(self, key)));
  }

  function update4(self, key, f, a) {
    return IAssociative.assoc(self, key, f(get(self, key), a));
  }

  function update5(self, key, f, a, b) {
    return IAssociative.assoc(self, key, f(get(self, key), a, b));
  }

  function update6(self, key, f, a, b, c) {
    return IAssociative.assoc(self, key, f(get(self, key), a, b, c));
  }

  function updateN(self, key, f) {
    var tgt = get(self, key),
        args = [tgt].concat(slice(arguments, 3));
    return IAssociative.assoc(self, key, f.apply(this, args));
  }

  var update = overload(null, null, null, update3, update4, update5, update6, updateN);

  function updateIn3(self, keys, f) {
    var k = keys[0],
        ks = toArray$7(rest$d(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn3(get(self, k), ks, f)) : update3(self, k, f);
  }

  function updateIn4(self, keys, f, a) {
    var k = keys[0],
        ks = toArray$7(rest$d(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn4(get(self, k), ks, f, a)) : update4(self, k, f, a);
  }

  function updateIn5(self, keys, f, a, b) {
    var k = keys[0],
        ks = toArray$7(rest$d(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn5(get(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
  }

  function updateIn6(self, key, f, a, b, c) {
    var k = keys[0],
        ks = toArray$7(rest$d(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn6(get(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
  }

  function updateInN(self, keys, f) {
    return updateIn3(self, keys, function (obj) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return f.apply(null, [obj].concat(args));
    });
  }

  function contains3(self, key, value) {
    return IAssociative.contains(self, key) && get(self, key) === value;
  }

  var contains$a = overload(null, null, IAssociative.contains, contains3);
  var updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);
  var rewrite = branch(IAssociative.contains, update, identity);
  var prop = overload(null, function (key) {
    return overload(null, function (v) {
      return get(v, key);
    }, function (v) {
      return assoc$a(v, key, v);
    });
  }, get, assoc$a);

  function patch2(target, source) {
    return reducekv$b(function (memo, key, value) {
      return assoc$a(memo, key, typeof value === "function" ? value(get(memo, key)) : value);
    }, target, source);
  }

  var patch = overload(null, identity, patch2, reducing(patch2));

  function merge$5(target, source) {
    return reducekv$b(assoc$a, target, source);
  }

  function mergeWith3(f, init, x) {
    return reducekv$b(function (memo, key, value) {
      return assoc$a(memo, key, contains$a(memo, key) ? f(get(memo, key), value) : f(value));
    }, init, x);
  }

  function mergeWithN(f, init) {
    var _f, _mergeWith;

    for (var _len = arguments.length, xs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      xs[_key - 2] = arguments[_key];
    }

    return reduce$f((_mergeWith = mergeWith3, _f = f, function mergeWith3(_argPlaceholder, _argPlaceholder2) {
      return _mergeWith(_f, _argPlaceholder, _argPlaceholder2);
    }), init, xs);
  }

  var mergeWith = overload(null, null, null, mergeWith3, mergeWithN);
  var IMergable = protocol({
    merge: merge$5
  });

  var INamable = protocol({
    name: null
  });

  var INext = protocol({
    next: null
  });

  var IOtherwise = protocol({
    otherwise: identity
  });

  var IPath = protocol({
    path: null
  });

  var IPrependable = protocol({
    prepend: null
  });

  var IReset = protocol({
    reset: null
  });

  var IReversible = protocol({
    reverse: null
  });

  var IRevertible = protocol({
    undo: null,
    redo: null,
    flush: null,
    undoable: null,
    redoable: null
  });

  var ISend = protocol({
    send: null
  });

  var ISeqable = protocol({
    seq: null
  });

  var ISequential$1 = protocol();

  var IOmissible = protocol({
    omit: null
  });

  var omit$3 = IOmissible.omit;

  var conj$8 = overload(function () {
    return [];
  }, identity, ICollection.conj, reducing(ICollection.conj));
  var unconj$1 = overload(null, identity, ICollection.unconj, reducing(ICollection.unconj));

  function excludes2(self, value) {
    return !IInclusive.includes(self, value);
  }

  function includesN(self) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    for (var _i = 0, _args = args; _i < _args.length; _i++) {
      var arg = _args[_i];

      if (!IInclusive.includes(self, arg)) {
        return false;
      }
    }

    return true;
  }

  function excludesN(self) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    for (var _i2 = 0, _args2 = args; _i2 < _args2.length; _i2++) {
      var arg = _args2[_i2];

      if (IInclusive.includes(self, arg)) {
        return false;
      }
    }

    return true;
  }

  var includes$9 = overload(null, constantly(true), IInclusive.includes, includesN);
  var excludes = overload(null, constantly(false), excludes2, excludesN);
  var transpose = branch(IInclusive.includes, omit$3, conj$8);

  function unite$1(self, value) {
    return includes$9(self, value) ? self : conj$8(self, value);
  }

  var ISet = protocol({
    unite: unite$1,
    disj: null
  });

  var IStateMachine = protocol({
    state: null,
    transition: null,
    transitions: null
  });

  var ISplittable = protocol({
    split: null
  });

  var ISwap = protocol({
    swap: null
  });

  var ITemplate = protocol({
    fill: null
  });

  function EmptyList() {}
  function emptyList() {
    return new EmptyList();
  }
  EmptyList.prototype[_Symbol.toStringTag] = "EmptyList";

  var isArray = Array.isArray.bind(Array);
  function emptyArray() {
    return [];
  }
  function array() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  }

  var count$d = ICounted.count;

  var next$a = INext.next;

  function Reduced(value) {
    this.value = value;
  }

  Reduced.prototype.valueOf = function () {
    return this.value;
  };

  function reduced$1(value) {
    return new Reduced(value);
  }
  function isReduced(value) {
    return value instanceof Reduced;
  }

  function equiv$9(self, other) {
    return self === other || IEquiv.equiv(self, other);
  }

  function alike2(self, other) {
    return alike3(self, other, Object.keys(self)); //Object.keys looks to internal properties
  }

  function alike3(self, other, keys) {
    //same parts? structural equality?
    return reduce$f(function (memo, key) {
      return memo ? equiv$9(self[key], other[key]) : reduced$1(memo);
    }, true, keys);
  }

  var alike = overload(null, null, alike2, alike3);
  function equivalent() {
    function equiv(self, other) {
      return kin(self, other) && alike(self, other);
    }

    return implement(IEquiv, {
      equiv: equiv
    });
  }

  function eqN() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return everyPair(equiv$9, args);
  }

  var eq = overload(constantly(true), constantly(true), equiv$9, eqN);
  var notEq = complement(eq);

  function reduce$e(self, f, init) {
    return init;
  }

  function equiv$8(xs, ys) {
    return !!satisfies(ISequential$1, xs) === !!satisfies(ISequential$1, ys) && count$d(xs) === count$d(ys) && equiv$9(first$d(xs), first$d(ys)) && equiv$9(next$a(xs), next$a(ys));
  }
  var iequiv = implement(IEquiv, {
    equiv: equiv$8
  });
  var behave$z = does(iequiv, implement(ISequential$1), implement(IBlankable, {
    blank: constantly(true)
  }), implement(IReversible, {
    reverse: emptyList
  }), implement(ICounted, {
    count: constantly(0)
  }), implement(IEmptyableCollection, {
    empty: identity
  }), implement(IInclusive, {
    includes: constantly(false)
  }), implement(IKVReduce, {
    reducekv: reduce$e
  }), implement(IReduce, {
    reduce: reduce$e
  }), implement(ICoercible, {
    toArray: emptyArray
  }), implement(ISeq, {
    first: constantly(null),
    rest: emptyList
  }), implement(INext, {
    next: constantly(null)
  }), implement(ISeqable, {
    seq: constantly(null)
  }));

  behave$z(EmptyList);

  function compare$6(x, y) {
    if (x === y) {
      return 0;
    } else if (isNil(x)) {
      return -1;
    } else if (isNil(y)) {
      return 1;
    } else if (x.constructor === y.constructor) {
      //TODO use `what`?
      return IComparable.compare(x, y);
    } else {
      throw new TypeError("Cannot compare different types.");
    }
  }

  function lt2(a, b) {
    return compare$6(a, b) < 0;
  }

  function ltN() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return everyPair(lt2, args);
  }

  var lt = overload(constantly(false), constantly(true), lt2, ltN);
  var lte2 = or(lt2, equiv$9);

  function lteN() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return everyPair(lte2, args);
  }

  var lte = overload(constantly(false), constantly(true), lte2, lteN);

  function gt2(a, b) {
    return compare$6(a, b) > 0;
  }

  function gtN() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return everyPair(gt2, args);
  }

  var gt = overload(constantly(false), constantly(true), gt2, gtN);
  var gte2 = or(equiv$9, gt2);

  function gteN() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return everyPair(gte2, args);
  }

  var gte = overload(constantly(false), constantly(true), gte2, gteN);

  var _, _IAddable$add, _IAddable, _2, _IAddable$add2, _IAddable2;
  function directed(start, step) {
    return compare$6(IAddable.add(start, step), start);
  }
  function steps(Type, pred) {
    return function (start, end, step) {
      if (start == null && end == null) {
        return new Type();
      }

      if (start != null && !pred(start)) {
        throw Error(Type.name + " passed invalid start value.");
      }

      if (end != null && !pred(end)) {
        throw Error(Type.name + " passed invalid end value.");
      }

      if (start == null && end != null) {
        throw Error(Type.name + " cannot get started without a beginning.");
      }

      var direction = directed(start, step);

      if (direction === 0) {
        throw Error(Type.name + " lacks direction.");
      }

      return new Type(start, end, step, direction);
    };
  }

  function subtract2(self, n) {
    return IAddable.add(self, IInverse.inverse(n));
  }

  var subtract = overload(constantly(0), identity, subtract2, reducing(subtract2));
  var add$3 = overload(constantly(0), identity, IAddable.add, reducing(IAddable.add));
  var inc = overload(constantly(+1), (_IAddable = IAddable, _IAddable$add = _IAddable.add, _ = +1, function add(_argPlaceholder) {
    return _IAddable$add.call(_IAddable, _argPlaceholder, _);
  }));
  var dec = overload(constantly(-1), (_IAddable2 = IAddable, _IAddable$add2 = _IAddable2.add, _2 = -1, function add(_argPlaceholder2) {
    return _IAddable$add2.call(_IAddable2, _argPlaceholder2, _2);
  }));

  function number() {
    return Number.apply(void 0, arguments);
  }
  var num = unary(number);
  var _int = parseInt;
  var _float = parseFloat;
  function isNaN$1(n) {
    return n !== n;
  }
  function isNumber(n) {
    return Number(n) === n;
  }
  function isInteger(n) {
    return Number(n) === n && n % 1 === 0;
  }
  var isInt = isInteger;
  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  function mod(n, div) {
    return n % div;
  }

  function min2(x, y) {
    return compare$6(x, y) < 0 ? x : y;
  }

  function max2(x, y) {
    return compare$6(x, y) > 0 ? x : y;
  }

  var min = overload(null, identity, min2, reducing(min2));
  var max = overload(null, identity, max2, reducing(max2));
  function isZero(x) {
    return x === 0;
  }
  function isPos(x) {
    return x > 0;
  }
  function isNeg(x) {
    return x < 0;
  }
  function isOdd(n) {
    return n % 2;
  }
  var isEven = complement(isOdd);
  function clamp(self, min, max) {
    return self < min ? min : self > max ? max : self;
  }

  function rand0() {
    return Math.random();
  }

  function rand1(n) {
    return Math.random() * n;
  }

  var rand = overload(rand0, rand1);
  function randInt(n) {
    return Math.floor(rand(n));
  }
  function sum(ns) {
    return reduce$f(add$3, 0, ns);
  }
  function least(ns) {
    return reduce$f(min, Number.POSITIVE_INFINITY, ns);
  }
  function most$1(ns) {
    return reduce$f(max, Number.NEGATIVE_INFINITY, ns);
  }
  function average$1(ns) {
    return sum(ns) / count$d(ns);
  }
  function measure(ns) {
    return {
      count: count$d(ns),
      sum: sum(ns),
      least: least(ns),
      most: most$1(ns),
      average: average$1(ns)
    };
  }

  function compare$5(self, other) {
    return self === other ? 0 : self - other;
  }

  function add$2(self, other) {
    return self + other;
  }

  function inverse$3(self) {
    return self * -1;
  }

  function mult$1(self, n) {
    return self * n;
  }

  function divide$3(self, n) {
    return self / n;
  }

  var start$3 = identity,
      end$3 = identity;
  var behave$y = does(implement(IDivisible, {
    divide: divide$3
  }), implement(IMultipliable, {
    mult: mult$1
  }), implement(IBounds, {
    start: start$3,
    end: end$3
  }), implement(IComparable, {
    compare: compare$5
  }), implement(IInverse, {
    inverse: inverse$3
  }), implement(IAddable, {
    add: add$2
  }));

  var behaviors = {};

  Object.assign(behaviors, {
    Number: behave$y
  });
  behave$y(Number);

  function LazySeq(perform) {
    this.perform = perform;
  }
  function lazySeq(perform) {
    if (typeof perform !== "function") {
      throw new Error("Lazy Seq needs a thunk.");
    }

    return new LazySeq(once(perform));
  }

  function _boolean() {
    return Boolean.apply(void 0, arguments);
  }
  var bool = _boolean;

  function isBoolean(self) {
    return Boolean(self) === self;
  }
  function not(self) {
    return !self;
  }
  function isTrue(self) {
    return self === true;
  }
  function isFalse(self) {
    return self === false;
  }

  function compare$4(self, other) {
    return self === other ? 0 : self === true ? 1 : -1;
  }

  function inverse$2(self) {
    return !self;
  }

  var behave$x = does(implement(IComparable, {
    compare: compare$4
  }), implement(IInverse, {
    inverse: inverse$2
  }));

  Object.assign(behaviors, {
    Boolean: behave$x
  });
  behave$x(Boolean);

  function List(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  function cons2(head, tail) {
    return new List(head, tail || emptyList());
  }

  var _consN = reducing(cons2);

  function consN() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _consN.apply(this, args.concat([emptyList()]));
  }

  var cons = overload(emptyList, cons2, cons2, consN);
  List.prototype[_Symbol.toStringTag] = "List";
  function isList(self) {
    return self && self.constructor === List || self.constructor === EmptyList;
  }
  function list() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return reduce$f(function (memo, value) {
      return cons(value, memo);
    }, emptyList(), args.reverse());
  }

  var merge$4 = overload(null, identity, IMergable.merge, reducing(IMergable.merge));

  function assoc$9(self, key, value) {
    var obj = {};
    obj[key] = value;
    return obj;
  }

  function reduce$d(self, f, init) {
    return init;
  }

  function equiv$7(self, other) {
    return null == other;
  }

  function otherwise$4(self, other) {
    return other;
  }

  function fork$8(self, reject, resolve) {
    return reject(self);
  }

  function conj$7(self, value) {
    return cons(value);
  }

  function merge$3(self) {
    for (var _len = arguments.length, xs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      xs[_key - 1] = arguments[_key];
    }

    return count$d(xs) ? merge$4.apply(null, Array.from(xs)) : null;
  }

  var behave$w = does(implement(IClonable, {
    clone: identity
  }), implement(ICompactible, {
    compact: identity
  }), implement(ICollection, {
    conj: conj$7
  }), implement(IBlankable, {
    blank: constantly(true)
  }), implement(IMergable, {
    merge: merge$3
  }), implement(IMap, {
    keys: nil,
    vals: nil,
    dissoc: nil
  }), implement(IForkable, {
    fork: fork$8
  }), implement(IEmptyableCollection, {
    empty: identity
  }), implement(IOtherwise, {
    otherwise: otherwise$4
  }), implement(IEquiv, {
    equiv: equiv$7
  }), implement(ILookup, {
    lookup: identity
  }), implement(IInclusive, {
    includes: constantly(false)
  }), implement(IAssociative, {
    assoc: assoc$9,
    contains: constantly(false)
  }), implement(INext, {
    next: identity
  }), implement(ICoercible, {
    toArray: emptyArray
  }), implement(ISeq, {
    first: identity,
    rest: emptyList
  }), implement(ISeqable, {
    seq: identity
  }), implement(IIndexed, {
    nth: identity
  }), implement(ICounted, {
    count: constantly(0)
  }), implement(IKVReduce, {
    reducekv: reduce$d
  }), implement(IReduce, {
    reduce: reduce$d
  }));

  behave$w(Nil);

  var deref$8 = IDeref.deref;

  var fmap$b = overload(constantly(identity), IFunctor.fmap, reducing(IFunctor.fmap));
  function thrush(unit, init) {
    for (var _len = arguments.length, fs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      fs[_key - 2] = arguments[_key];
    }

    return deref$8(reduce$f(IFunctor.fmap, unit(init), fs));
  }

  function pipeline1(unit) {
    return partial(pipelineN, unit);
  }

  function pipelineN(unit) {
    for (var _len2 = arguments.length, fs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      fs[_key2 - 1] = arguments[_key2];
    }

    return function (init) {
      return thrush.apply(void 0, [unit, init].concat(fs));
    };
  }

  var pipeline = overload(null, pipeline1, pipelineN);

  function Maybe(value) {
    this.value = value;
  }

  function maybe1(x) {
    return new Maybe(x);
  }

  var maybe = overload(null, maybe1, partial(thrush, maybe1));
  var opt = pipeline(maybe1);
  function isMaybe(self) {
    return self instanceof Maybe;
  }

  var inverse$1 = IInverse.inverse;

  var seq$a = ISeqable.seq;

  function Range(start, end, step, direction) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.direction = direction;
  }
  function emptyRange() {
    return new Range();
  }

  function range0() {
    return range1(Number.POSITIVE_INFINITY);
  }

  function range1(end) {
    return range3(0, end, 1);
  }

  function range2(start, end) {
    return range3(start, end, 1);
  }

  var range3 = steps(Range, isNumber);
  var range = overload(range0, range1, range2, range3);
  Range.prototype[_Symbol.toStringTag] = "Range";

  function emptyString() {
    return "";
  }

  var _param$1, _upperCase, _replace;
  function isBlank(str) {
    return str == null || typeof str === "string" && str.trim().length === 0;
  }

  function str1(x) {
    return x == null ? "" : x.toString();
  }

  function str2(x, y) {
    return str1(x) + str1(y);
  }

  function camelToDashed(str) {
    return str.replace(/[A-Z]/, function (x) {
      return "-" + x.toLowerCase();
    });
  }
  var startsWith = unbind(String.prototype.startsWith);
  var endsWith = unbind(String.prototype.endsWith);
  var replace = unbind(String.prototype.replace);
  var subs = unbind(String.prototype.substring);
  var lowerCase = unbind(String.prototype.toLowerCase);
  var upperCase = unbind(String.prototype.toUpperCase);
  var titleCase = (_replace = replace, _param$1 = /(^|\s|\.)(\S|\.)/g, _upperCase = upperCase, function replace(_argPlaceholder) {
    return _replace(_argPlaceholder, _param$1, _upperCase);
  });
  var lpad = unbind(String.prototype.padStart);
  var rpad = unbind(String.prototype.padEnd);
  var trim = unbind(String.prototype.trim);
  var rtrim = unbind(String.prototype.trimRight);
  var ltrim = unbind(String.prototype.trimLeft);
  var str = overload(emptyString, str1, str2, reducing(str2));
  function zeros(value, n) {
    return lpad(str(value), n, "0");
  }

  function _toConsumableArray$2(arr) { return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$9(arr) || _nonIterableSpread$2(); }

  function _nonIterableSpread$2() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$9(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$9(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$9(o, minLen); }

  function _iterableToArray$2(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles$2(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$9(arr); }

  function _arrayLikeToArray$9(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function spread(f) {
    return function (args) {
      return f.apply(void 0, _toConsumableArray$2(toArray$7(args)));
    };
  }
  function realize(g) {
    return isFunction(g) ? g() : g;
  }
  function realized(f) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return apply(f, reduce$f(function (memo, arg) {
        memo.push(realize(arg));
        return memo;
      }, [], args));
    };
  }
  function juxt() {
    for (var _len2 = arguments.length, fs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fs[_key2] = arguments[_key2];
    }

    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return reduce$f(function (memo, f) {
        return memo.concat([f.apply(this, args)]);
      }, [], fs);
    };
  }

  function apply2(f, args) {
    return f.apply(null, toArray$7(args));
  }

  function apply3(f, a, args) {
    return f.apply(null, [a].concat(toArray$7(args)));
  }

  function apply4(f, a, b, args) {
    return f.apply(null, [a, b].concat(toArray$7(args)));
  }

  function apply5(f, a, b, c, args) {
    return f.apply(null, [a, b, c].concat(toArray$7(args)));
  }

  function applyN(f, a, b, c, d, args) {
    return f.apply(null, [a, b, c, d].concat(toArray$7(args)));
  }

  var apply = overload(null, null, apply2, apply3, apply4, apply5, applyN);
  function multi(dispatch) {
    return function () {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var f = apply(dispatch, args);

      if (!f) {
        throw Error("Failed dispatch");
      }

      return apply(f, args);
    };
  }
  function tee(f) {
    return function (value) {
      f(value);
      return value;
    };
  }
  function see() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return tee(function (obj) {
      apply(log, conj$8(args, obj));
    });
  }
  function flip(f) {
    return function (b, a) {
      for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
        args[_key6 - 2] = arguments[_key6];
      }

      return f.apply(this, [a, b].concat(args));
    };
  }
  function fnil(f) {
    for (var _len7 = arguments.length, substitutes = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      substitutes[_key7 - 1] = arguments[_key7];
    }

    return function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      for (var x = 0; x < substitutes.length; x++) {
        if (isNil(args[x])) {
          args[x] = substitutes[x];
        }
      }

      return f.apply(void 0, args);
    };
  }

  function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

  function filter$1(pred, xs) {
    return seq$a(xs) ? lazySeq(function () {
      var ys = xs;

      var _loop = function _loop() {
        var head = first$d(ys),
            tail = rest$d(ys);

        if (pred(head)) {
          return {
            v: cons(head, lazySeq(function () {
              return filter$1(pred, tail);
            }))
          };
        }

        ys = tail;
      };

      while (seq$a(ys)) {
        var _ret = _loop();

        if (_typeof$2(_ret) === "object") return _ret.v;
      }

      return emptyList();
    }) : emptyList();
  }

  function Concatenated(colls) {
    this.colls = colls;
  }
  function concatenated(xs) {
    var colls = filter$1(seq$a, xs);
    return seq$a(colls) ? new Concatenated(colls) : emptyList();
  }
  function isConcatenated(self) {
    return self.constructor === Concatenated;
  }
  Concatenated.prototype[_Symbol.toStringTag] = "Concatenated";
  var concat = overload(emptyList, seq$a, unspread(concatenated));

  var keys$b = IMap.keys;
  var vals$6 = IMap.vals;

  function dissocN(obj) {
    for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keys[_key - 1] = arguments[_key];
    }

    return reduce$f(IMap.dissoc, obj, keys);
  }

  var dissoc$6 = overload(null, identity, IMap.dissoc, dissocN);

  var nth$6 = IIndexed.nth;
  var idx$3 = IIndexed.idx;

  var reverse$4 = IReversible.reverse;

  function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

  function _slicedToArray$6(arr, i) { return _arrayWithHoles$6(arr) || _iterableToArrayLimit$6(arr, i) || _unsupportedIterableToArray$8(arr, i) || _nonIterableRest$6(); }

  function _nonIterableRest$6() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$8(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$8(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$8(o, minLen); }

  function _arrayLikeToArray$8(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$6(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$6(arr) { if (Array.isArray(arr)) return arr; }

  function map2(f, xs) {
    return seq$a(xs) ? lazySeq(function () {
      return cons(f(first$d(xs)), map2(f, rest$d(xs)));
    }) : emptyList();
  }

  function map3(f, c1, c2) {
    var s1 = seq$a(c1),
        s2 = seq$a(c2);
    return s1 && s2 ? lazySeq(function () {
      return cons(f(first$d(s1), first$d(s2)), map3(f, rest$d(s1), rest$d(s2)));
    }) : emptyList();
  }

  function mapN(f) {
    for (var _len = arguments.length, tail = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      tail[_key - 1] = arguments[_key];
    }

    var seqs = map(seq$a, tail);
    return notAny(isNil, seqs) ? lazySeq(function () {
      return cons(apply(f, mapa(first$d, seqs)), apply(mapN, f, mapa(rest$d, seqs)));
    }) : emptyList();
  }

  var map = overload(null, null, map2, map3, mapN);
  var mapa = comp(toArray$7, map);
  function mapArgs(xf, f) {
    return function () {
      var _xf, _maybe;

      return apply(f, mapa((_maybe = maybe, _xf = xf, function maybe(_argPlaceholder) {
        return _maybe(_argPlaceholder, _xf);
      }), slice(arguments)));
    };
  }
  function keyed(f, keys) {
    return reduce$f(function (memo, key) {
      return assoc$a(memo, key, f(key));
    }, {}, keys);
  }

  function transduce3(xform, f, coll) {
    return transduce4(xform, f, f(), coll);
  }

  function transduce4(xform, f, init, coll) {
    var step = xform(f);
    return step(reduce$f(step, init, coll));
  }

  var transduce = overload(null, null, null, transduce3, transduce4);

  function into2(to, from) {
    return reduce$f(conj$8, to, from);
  }

  function into3(to, xform, from) {
    return transduce(xform, conj$8, to, from);
  }

  var into = overload(emptyArray, identity, into2, into3); //TODO unnecessary if CQS pattern is that commands return self

  function doing1(f) {
    return doing2(f, identity);
  }

  function doing2(f, order) {
    return function (self) {
      var _self, _f;

      for (var _len2 = arguments.length, xs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        xs[_key2 - 1] = arguments[_key2];
      }

      each((_f = f, _self = self, function f(_argPlaceholder2) {
        return _f(_self, _argPlaceholder2);
      }), order(xs));
    };
  }

  var doing = overload(null, doing1, doing2); //mutating counterpart to `reducing`

  function each(f, xs) {
    var ys = seq$a(xs);

    while (ys) {
      f(first$d(ys));
      ys = next$a(ys);
    }
  }

  function doseq3(f, xs, ys) {
    each(function (x) {
      each(function (y) {
        f(x, y);
      }, ys);
    }, xs);
  }

  function doseq4(f, xs, ys, zs) {
    each(function (x) {
      each(function (y) {
        each(function (z) {
          f(x, y, z);
        }, zs);
      }, ys);
    }, xs);
  }

  function doseqN(f, xs) {
    for (var _len3 = arguments.length, colls = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      colls[_key3 - 2] = arguments[_key3];
    }

    each(function (x) {
      if (seq$a(colls)) {
        apply(doseq, function () {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          apply(f, x, args);
        }, colls);
      } else {
        f(x);
      }
    }, xs || []);
  }

  var doseq = overload(null, null, each, doseq3, doseq4, doseqN);
  function eachkv(f, xs) {
    each(function (_ref) {
      var _ref2 = _slicedToArray$6(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return f(key, value);
    }, entries(xs));
  }
  function eachvk(f, xs) {
    each(function (_ref3) {
      var _ref4 = _slicedToArray$6(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return f(value, key);
    }, entries(xs));
  }

  function entries2(xs, keys) {
    return seq$a(keys) ? lazySeq(function () {
      return cons([first$d(keys), get(xs, first$d(keys))], entries2(xs, rest$d(keys)));
    }) : emptyList();
  }

  function entries1(xs) {
    return entries2(xs, keys$b(xs));
  }

  var entries = overload(null, entries1, entries2);
  function mapkv(f, xs) {
    return map(function (_ref5) {
      var _ref6 = _slicedToArray$6(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      return f(key, value);
    }, entries(xs));
  }
  function mapvk(f, xs) {
    return map(function (_ref7) {
      var _ref8 = _slicedToArray$6(_ref7, 2),
          key = _ref8[0],
          value = _ref8[1];

      return f(value, key);
    }, entries(xs));
  }
  function seek() {
    for (var _len5 = arguments.length, fs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      fs[_key5] = arguments[_key5];
    }

    return function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return reduce$f(function (memo, f) {
        return memo == null ? f.apply(void 0, args) : reduced$1(memo);
      }, null, fs);
    };
  }
  function some$1(f, coll) {
    var xs = seq$a(coll);

    while (xs) {
      var value = f(first$d(xs));

      if (value) {
        return value;
      }

      xs = next$a(xs);
    }

    return null;
  }
  var notSome = comp(not, some$1);
  var notAny = notSome;
  function every(pred, coll) {
    var xs = seq$a(coll);

    while (xs) {
      if (!pred(first$d(xs))) {
        return false;
      }

      xs = next$a(xs);
    }

    return true;
  }
  var notEvery = comp(not, every);
  function mapSome(f, pred, coll) {
    return map(function (value) {
      return pred(value) ? f(value) : value;
    }, coll);
  }
  function mapcat(f, colls) {
    return concatenated(map(f, colls));
  }
  function filter(pred, xs) {
    return seq$a(xs) ? lazySeq(function () {
      var ys = xs;

      var _loop = function _loop() {
        var head = first$d(ys),
            tail = rest$d(ys);

        if (pred(head)) {
          return {
            v: cons(head, lazySeq(function () {
              return filter(pred, tail);
            }))
          };
        }

        ys = tail;
      };

      while (seq$a(ys)) {
        var _ret = _loop();

        if (_typeof$1(_ret) === "object") return _ret.v;
      }

      return emptyList();
    }) : emptyList();
  }
  var detect = comp(first$d, filter);
  function cycle(coll) {
    return seq$a(coll) ? lazySeq(function () {
      return cons(first$d(coll), concat(rest$d(coll), cycle(coll)));
    }) : emptyList();
  }
  function treeSeq(branch, children, root) {
    function walk(node) {
      return cons(node, branch(node) ? mapcat(walk, children(node)) : emptyList());
    }

    return walk(root);
  }
  function flatten(coll) {
    return filter(complement(satisfies(ISequential$1)), rest$d(treeSeq(satisfies(ISequential$1), seq$a, coll)));
  }
  function zip() {
    for (var _len7 = arguments.length, colls = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      colls[_key7] = arguments[_key7];
    }

    return mapcat(identity, map.apply(void 0, [seq$a].concat(colls)));
  }
  var filtera = comp(toArray$7, filter);
  function remove$1(pred, xs) {
    return filter(complement(pred), xs);
  }
  function keep(f, xs) {
    return filter(isSome, map(f, xs));
  }
  function drop(n, coll) {
    var i = n,
        xs = seq$a(coll);

    while (i > 0 && xs) {
      xs = rest$d(xs);
      i = i - 1;
    }

    return xs;
  }
  function dropWhile(pred, xs) {
    return seq$a(xs) ? pred(first$d(xs)) ? dropWhile(pred, rest$d(xs)) : xs : emptyList();
  }
  function dropLast(n, coll) {
    return map(function (x, _) {
      return x;
    }, coll, drop(n, coll));
  }
  function take(n, coll) {
    var xs = seq$a(coll);
    return n > 0 && xs ? lazySeq(function () {
      return cons(first$d(xs), take(n - 1, rest$d(xs)));
    }) : emptyList();
  }
  function takeWhile(pred, xs) {
    return seq$a(xs) ? lazySeq(function () {
      var item = first$d(xs);
      return pred(item) ? cons(item, lazySeq(function () {
        return takeWhile(pred, rest$d(xs));
      })) : emptyList();
    }) : emptyList();
  }
  function takeNth(n, xs) {
    return seq$a(xs) ? lazySeq(function () {
      return cons(first$d(xs), takeNth(n, drop(n, xs)));
    }) : emptyList();
  }
  function takeLast(n, coll) {
    return n ? drop(count$d(coll) - n, coll) : emptyList();
  }

  function interleave2(xs, ys) {
    var as = seq$a(xs),
        bs = seq$a(ys);
    return as != null && bs != null ? cons(first$d(as), lazySeq(function () {
      return cons(first$d(bs), interleave2(rest$d(as), rest$d(bs)));
    })) : emptyList();
  }

  function interleaveN() {
    for (var _len8 = arguments.length, colls = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      colls[_key8] = arguments[_key8];
    }

    return concatenated(interleaved(colls));
  }

  function interleaved(colls) {
    return seq$a(filter(isNil, colls)) ? emptyList() : lazySeq(function () {
      return cons(map(first$d, colls), interleaved(map(next$a, colls)));
    });
  }
  var interleave = overload(null, null, interleave2, interleaveN);
  function interpose(sep, xs) {
    return drop(1, interleave2(repeat1(sep), xs));
  }

  function partition2(n, xs) {
    return partition3(n, n, xs);
  }

  function partition3(n, step, xs) {
    var coll = seq$a(xs);
    if (!coll) return xs;
    var part = take(n, coll);
    return n === count$d(part) ? cons(part, partition3(n, step, drop(step, coll))) : emptyList();
  }

  function partition4(n, step, pad, xs) {
    var coll = seq$a(xs);
    if (!coll) return xs;
    var part = take(n, coll);
    return n === count$d(part) ? cons(part, partition4(n, step, pad, drop(step, coll))) : cons(take(n, concat(part, pad)));
  }

  var partition = overload(null, null, partition2, partition3, partition4);
  function partitionAll1(n) {
    return partial(partitionAll, n);
  }
  function partitionAll2(n, xs) {
    return partitionAll3(n, n, xs);
  }
  function partitionAll3(n, step, xs) {
    var coll = seq$a(xs);
    if (!coll) return xs;
    return cons(take(n, coll), partitionAll3(n, step, drop(step, coll)));
  }
  var partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);
  function partitionBy(f, xs) {
    var coll = seq$a(xs);
    if (!coll) return xs;
    var head = first$d(coll),
        val = f(head),
        run = cons(head, takeWhile(function (x) {
      return val === f(x);
    }, next$a(coll)));
    return cons(run, partitionBy(f, seq$a(drop(count$d(run), coll))));
  }
  function last(coll) {
    var xs = coll,
        ys = null;

    while (ys = next$a(xs)) {
      xs = ys;
    }

    return first$d(xs);
  }

  function dedupe1(coll) {
    return dedupe2(identity, coll);
  }

  function dedupe2(f, coll) {
    return dedupe3(f, equiv$9, coll);
  }

  function dedupe3(f, equiv, coll) {
    return seq$a(coll) ? lazySeq(function () {
      var xs = seq$a(coll);
      var last = first$d(xs);

      while (next$a(xs) && equiv(f(first$d(next$a(xs))), f(last))) {
        xs = next$a(xs);
      }

      return cons(last, dedupe2(f, next$a(xs)));
    }) : coll;
  }

  var dedupe = overload(null, dedupe1, dedupe2, dedupe3);

  function repeatedly1(f) {
    return lazySeq(function () {
      return cons(f(), repeatedly1(f));
    });
  }

  function repeatedly2(n, f) {
    return take(n, repeatedly1(f));
  }

  var repeatedly = overload(null, repeatedly1, repeatedly2);

  function repeat1(x) {
    return repeatedly1(constantly(x));
  }

  function repeat2(n, x) {
    return repeatedly2(n, constantly(x));
  }

  var repeat = overload(null, repeat1, repeat2);
  function isEmpty(coll) {
    return !seq$a(coll);
  }
  function notEmpty(coll) {
    return isEmpty(coll) ? null : coll;
  }

  function asc2(compare, f) {
    return function (a, b) {
      return compare(f(a), f(b));
    };
  }

  function asc1(f) {
    return asc2(compare$6, f);
  }

  var asc = overload(constantly(compare$6), asc1, asc2);

  function desc0() {
    return function (a, b) {
      return compare$6(b, a);
    };
  }

  function desc2(compare, f) {
    return function (a, b) {
      return compare(f(b), f(a));
    };
  }

  function desc1(f) {
    return desc2(compare$6, f);
  }

  var desc = overload(desc0, desc1, desc2);

  function sort1(coll) {
    return sort2(compare$6, coll);
  }

  function sort2(compare, coll) {
    return into([], coll).sort(compare);
  }

  function sortN() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    var compares = initial(args),
        coll = last(args);

    function compare(x, y) {
      return reduce$f(function (memo, compare) {
        return memo === 0 ? compare(x, y) : reduced$1(memo);
      }, 0, compares);
    }

    return sort2(compare, coll);
  }

  var sort = overload(null, sort1, sort2, sortN);

  function sortBy2(keyFn, coll) {
    return sortBy3(keyFn, compare$6, coll);
  }

  function sortBy3(keyFn, compare, coll) {
    return sort(function (x, y) {
      return compare$6(keyFn(x), keyFn(y));
    }, coll);
  }

  var sortBy = overload(null, null, sortBy2, sortBy3);
  function withIndex(iter) {
    return function (f, xs) {
      var idx = -1;
      return iter(function (x) {
        return f(++idx, x);
      }, xs);
    };
  }
  var butlast = partial(dropLast, 1);
  var initial = butlast;
  var eachIndexed = withIndex(each);
  var mapIndexed = withIndex(map);
  var keepIndexed = withIndex(keep);
  var splitAt = juxt(take, drop);
  var splitWith = juxt(takeWhile, dropWhile);

  function braid3(f, xs, ys) {
    return mapcat(function (x) {
      return map(function (y) {
        return f(x, y);
      }, ys);
    }, xs);
  }

  function braid4(f, xs, ys, zs) {
    return mapcat(function (x) {
      return mapcat(function (y) {
        return map(function (z) {
          return f(x, y, z);
        }, zs);
      }, ys);
    }, xs);
  }

  function braidN(f, xs) {
    for (var _len10 = arguments.length, colls = new Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
      colls[_key10 - 2] = arguments[_key10];
    }

    if (seq$a(colls)) {
      return mapcat(function (x) {
        return apply(braid, function () {
          for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
          }

          return apply(f, x, args);
        }, colls);
      }, xs);
    } else {
      return map(f, xs || []);
    }
  } //Clojure's `for`; however, could not use the name as it's a reserved word in JavaScript.


  var braid = overload(null, null, map, braid3, braid4, braidN);

  function best2(better, xs) {
    var coll = seq$a(xs);
    return coll ? reduce$f(function (a, b) {
      return better(a, b) ? a : b;
    }, first$d(coll), rest$d(coll)) : null;
  }

  function best3(f, better, xs) {
    var coll = seq$a(xs);
    return coll ? reduce$f(function (a, b) {
      return better(f(a), f(b)) ? a : b;
    }, first$d(coll), rest$d(coll)) : null;
  }

  var best = overload(null, best2, best3);

  function scan1(xs) {
    return scan2(2, xs);
  }

  function scan2(n, xs) {
    return lazySeq(function () {
      var ys = take(n, xs);
      return count$d(ys) === n ? cons(ys, scan2(n, rest$d(xs))) : emptyList();
    });
  }

  var scan = overload(null, scan1, scan2);

  function isDistinct1(coll) {
    var seen = new Set();
    return reduce$f(function (memo, x) {
      if (memo && seen.has(x)) {
        return reduced$1(false);
      }

      seen.add(x);
      return memo;
    }, true, coll);
  }

  function isDistinctN() {
    for (var _len12 = arguments.length, xs = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      xs[_key12] = arguments[_key12];
    }

    return isDistinct1(xs);
  }

  var isDistinct = overload(null, constantly(true), function (a, b) {
    return a !== b;
  }, isDistinctN);

  function dorun1(coll) {
    var xs = seq$a(coll);

    while (xs) {
      xs = next$a(xs);
    }
  }

  function dorun2(n, coll) {
    var xs = seq$a(coll);

    while (xs && n > 0) {
      n++;
      xs = next$a(xs);
    }
  }

  var dorun = overload(null, dorun1, dorun2);

  function doall1(coll) {
    dorun(coll);
    return coll;
  }

  function doall2(n, coll) {
    dorun(n, coll);
    return coll;
  }

  var doall = overload(null, doall1, doall2);
  function iterate$1(f, x) {
    return lazySeq(function () {
      return cons(x, iterate$1(f, f(x)));
    });
  }
  var integers = range(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1);
  var positives = range(1, Number.MAX_SAFE_INTEGER, 1);
  var negatives = range(-1, Number.MIN_SAFE_INTEGER, -1);
  function dotimes(n, f) {
    each(f, range(n));
  }
  function randNth(coll) {
    return nth$6(coll, randInt(count$d(coll)));
  }
  function cond() {
    for (var _len13 = arguments.length, xs = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      xs[_key13] = arguments[_key13];
    }

    var conditions = isEven(count$d(xs)) ? xs : Array.from(concat(butlast(xs), [constantly(true), last(xs)]));
    return function () {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }

      return reduce$f(function (memo, condition) {
        var pred = first$d(condition);
        return pred.apply(void 0, args) ? reduced$1(first$d(rest$d(condition))) : memo;
      }, null, partition(2, conditions));
    };
  }

  function join1(xs) {
    return into("", map2(str, xs));
  }

  function join2(sep, xs) {
    return join1(interpose(sep, xs));
  }

  var join = overload(null, join1, join2);
  function shuffle(coll) {
    var a = Array.from(coll);
    var j, x, i;

    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }

    return a;
  }
  function generate(iterable) {
    //e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
    var iter = iterable[_Symbol.iterator]();

    return function () {
      return iter.done ? null : iter.next().value;
    };
  }

  function splice4(self, start, nix, coll) {
    return concat(take(start, self), coll, drop(start + nix, self));
  }

  function splice3(self, start, coll) {
    return splice4(self, start, 0, coll);
  }

  var splice = overload(null, null, null, splice3, splice4);
  function also(f, xs) {
    return concat(xs, mapcat(function (x) {
      var result = f(x);
      return satisfies(ISequential$1, result) ? result : [result];
    }, xs));
  }
  function countBy(f, coll) {
    return reduce$f(function (memo, value) {
      var by = f(value),
          n = memo[by];
      memo[by] = n ? inc(n) : 1;
      return memo;
    }, {}, coll);
  }

  function groupBy3(init, f, coll) {
    return reduce$f(function (memo, value) {
      return update(memo, f(value), function (group) {
        return conj$8(group || [], value);
      });
    }, init, coll);
  }

  function groupBy2(f, coll) {
    return groupBy3({}, f, coll);
  }

  var groupBy = overload(null, null, groupBy2, groupBy3);

  function index4(init, key, val, coll) {
    return reduce$f(function (memo, x) {
      return assoc$a(memo, key(x), val(x));
    }, init, coll);
  }

  function index3(key, val, coll) {
    return index4({}, key, val, coll);
  }

  function index2(key, coll) {
    return index4({}, key, identity, coll);
  }

  var index = overload(null, null, index2, index3, index4);

  function lazyIterable1(iter) {
    return lazyIterable2(iter, emptyList());
  }

  function lazyIterable2(iter, done) {
    var res = iter.next();
    return res.done ? done : lazySeq(function () {
      return cons(res.value, lazyIterable1(iter));
    });
  }

  var lazyIterable = overload(null, lazyIterable1, lazyIterable2);

  function unreduced(self) {
    return isReduced(self) ? self.valueOf() : self;
  }

  function deref$7(self) {
    return self.valueOf();
  }

  var behave$v = does(implement(IDeref, {
    deref: deref$7
  }));

  behave$v(Reduced);

  var compact1$1 = partial(filter, identity);

  function compact2$1(self, pred) {
    return remove(pred, self);
  }

  var compact$2 = overload(null, compact1$1, compact2$1);

  function fmap$a(self, f) {
    return map(f, self);
  }

  function conj$6(self, value) {
    return cons(value, self);
  }

  function seq$9(self) {
    return seq$a(self.perform());
  }

  function blank$4(self) {
    return seq$9(self) == null;
  }

  function iterate(self) {
    var state = self;
    return {
      next: function next() {
        var result = seq$a(state) ? {
          value: first$d(state),
          done: false
        } : {
          done: true
        };
        state = next$a(state);
        return result;
      }
    };
  }

  function iterator() {
    return iterate(this);
  }

  function iterable(Type) {
    Type.prototype[_Symbol.iterator] = iterator;
  }
  function find$5(coll, key) {
    return reducekv$a(coll, function (memo, k, v) {
      return key === k ? reduced$1([k, v]) : memo;
    }, null);
  }

  function first$c(self) {
    return first$d(self.perform());
  }

  function rest$c(self) {
    return rest$d(self.perform());
  }

  function next$9(self) {
    return seq$a(rest$d(self));
  }

  function nth$5(self, n) {
    var xs = self,
        idx = 0;

    while (xs) {
      var x = first$d(xs);

      if (idx === n) {
        return x;
      }

      idx++;
      xs = next$a(xs);
    }

    return null;
  }

  function idx$2(self, x) {
    var xs = seq$a(self),
        n = 0;

    while (xs) {
      if (x === first$d(xs)) {
        return n;
      }

      n++;
      xs = next$a(xs);
    }

    return null;
  }

  function reduce$c(xs, f, init) {
    var memo = init,
        ys = seq$a(xs);

    while (ys && !(memo instanceof Reduced)) {
      memo = f(memo, first$d(ys));
      ys = next$a(ys);
    }

    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function reducekv$a(xs, f, init) {
    var memo = init,
        ys = seq$a(xs),
        idx = 0;

    while (ys && !(memo instanceof Reduced)) {
      memo = f(memo, idx++, first$d(ys));
      ys = next$a(ys);
    }

    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function toArray$6(xs) {
    var ys = xs;
    var zs = [];

    while (seq$a(ys) != null) {
      zs.push(first$d(ys));
      ys = rest$d(ys);
    }

    return zs;
  }

  function count$c(self) {
    return reduce$c(self, function (memo) {
      return memo + 1;
    }, 0);
  }

  function append$5(self, other) {
    return concat(self, [other]);
  }

  function omit$2(self, value) {
    return remove(function (x) {
      return x === value;
    }, self);
  }

  function includes$8(self, value) {
    return detect(function (x) {
      return x === value;
    }, self);
  }

  var reverse$3 = comp(reverse$4, toArray$6);
  var ilazyseq = does(iterable, iequiv, implement(IReduce, {
    reduce: reduce$c
  }), implement(IKVReduce, {
    reducekv: reducekv$a
  }), implement(ISequential$1), implement(IIndexed, {
    nth: nth$5,
    idx: idx$2
  }), implement(IReversible, {
    reverse: reverse$3
  }), implement(IBlankable, {
    blank: blank$4
  }), implement(ICompactible, {
    compact: compact$2
  }), implement(IInclusive, {
    includes: includes$8
  }), implement(IOmissible, {
    omit: omit$2
  }), implement(IFunctor, {
    fmap: fmap$a
  }), implement(ICollection, {
    conj: conj$6
  }), implement(ICoercible, {
    toArray: toArray$6
  }), implement(IAppendable, {
    append: append$5
  }), implement(IPrependable, {
    prepend: conj$6
  }), implement(ICounted, {
    count: count$c
  }), implement(IFind, {
    find: find$5
  }), implement(IEmptyableCollection, {
    empty: emptyList
  }), implement(ISeq, {
    first: first$c,
    rest: rest$c
  }), implement(ISeqable, {
    seq: seq$9
  }), implement(INext, {
    next: next$9
  }));

  ilazyseq(LazySeq);

  function Multimap(attrs, empty) {
    this.attrs = attrs;
    this.empty = empty;
  }
  function multimap(attrs, empty) {
    return new Multimap(attrs || {}, empty || function () {
      return [];
    });
  }

  var clone$5 = IClonable.clone;

  function toObject$2(self) {
    return self.attrs;
  }

  function contains$9(self, key) {
    return self.attrs.hasOwnProperty(key);
  }

  function lookup$b(self, key) {
    return get(self.attrs, key);
  }

  function seq$8(self) {
    return seq$a(self.attrs);
  }

  function count$b(self) {
    return count$d(self.attrs);
  }

  function first$b(self) {
    return first$d(seq$8(self));
  }

  function rest$b(self) {
    return rest$d(seq$8(self));
  }

  function keys$a(self) {
    return keys$b(self.attrs);
  }

  function vals$5(self) {
    return vals$6(self.attrs);
  }

  function assoc$8(self, key, value) {
    return Object.assign(clone$5(self), {
      attrs: assoc$a(self.attrs, key, value)
    });
  }

  function dissoc$5(self, key) {
    return Object.assign(clone$5(self), {
      attrs: dissoc$6(self.attrs, key)
    });
  }

  function equiv$6(self, other) {
    return count$d(self) === count$d(other) && reducekv$9(self, function (memo, key, value) {
      return memo ? equiv$9(get(other, key), value) : reduced$1(memo);
    }, true);
  }

  function empty$2(self) {
    return Object.assign(clone$5(self), {
      attrs: {}
    });
  }

  function reduce$b(self, f, init) {
    return reduce$f(function (memo, key) {
      return f(memo, [key, lookup$b(self, key)]);
    }, init, keys$b(self));
  }

  function reducekv$9(self, f, init) {
    return reduce$f(function (memo, key) {
      return f(memo, key, lookup$b(self, key));
    }, init, keys$b(self));
  }

  function construct(Type) {
    return function record(attrs) {
      return Object.assign(Object.create(Type.prototype), {
        attrs: attrs
      });
    };
  }
  function emptyable(Type) {
    function empty() {
      return new Type();
    }

    implement(IEmptyableCollection, {
      empty: empty
    }, Type);
  }
  var behave$u = does(emptyable, implement(IReduce, {
    reduce: reduce$b
  }), implement(IKVReduce, {
    reducekv: reducekv$9
  }), implement(IEquiv, {
    equiv: equiv$6
  }), implement(ICoercible, {
    toObject: toObject$2
  }), implement(IEmptyableCollection, {
    empty: empty$2
  }), implement(IAssociative, {
    assoc: assoc$8,
    contains: contains$9
  }), implement(ILookup, {
    lookup: lookup$b
  }), implement(IMap, {
    dissoc: dissoc$5,
    keys: keys$a,
    vals: vals$5
  }), implement(ISeq, {
    first: first$b,
    rest: rest$b
  }), implement(ICounted, {
    count: count$b
  }), implement(ISeqable, {
    seq: seq$8
  }));

  function _slicedToArray$5(arr, i) { return _arrayWithHoles$5(arr) || _iterableToArrayLimit$5(arr, i) || _unsupportedIterableToArray$7(arr, i) || _nonIterableRest$5(); }

  function _nonIterableRest$5() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$7(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$7(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$7(o, minLen); }

  function _arrayLikeToArray$7(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$5(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$5(arr) { if (Array.isArray(arr)) return arr; }

  function keys$9(self) {
    return Object.keys(self.attrs);
  }

  function count$a(self) {
    return count$d(seq$7(self));
  }

  function seq$7(self) {
    return concatenated(map(function (key) {
      return map(function (value) {
        return [key, value];
      }, seq$a(get(self, key)) || emptyList());
    }, keys$9(self)));
  }

  function first$a(self) {
    return first$d(seq$7(self));
  }

  function rest$a(self) {
    return rest$d(seq$7(self));
  }

  function lookup$a(self, key) {
    return get(self.attrs, key);
  }

  function assoc$7(self, key, value) {
    var values = lookup$a(self, key) || self.empty(key);
    return new self.constructor(assoc$a(self.attrs, key, conj$8(values, value)), self.empty);
  }

  function contains$8(self, key) {
    return contains$a(self.attrs, key);
  }

  function reduce$a(self, f, init) {
    return reduce$f(function (memo, pair) {
      return f(memo, pair);
    }, init, seq$7(self));
  }

  function reducekv$8(self, f, init) {
    return reduce$a(self, function (memo, _ref) {
      var _ref2 = _slicedToArray$5(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return f(memo, key, value);
    }, init);
  }

  var behave$t = does(behave$u, implement(IMap, {
    keys: keys$9
  }), implement(ICoercible, {
    toArray: comp(Array.from, seq$7)
  }), implement(IReduce, {
    reduce: reduce$a
  }), implement(IKVReduce, {
    reducekv: reducekv$8
  }), implement(ICounted, {
    count: count$a
  }), implement(ISeqable, {
    seq: seq$7
  }), implement(ILookup, {
    lookup: lookup$a
  }), implement(IAssociative, {
    assoc: assoc$7,
    contains: contains$8
  }), implement(ISeq, {
    first: first$a,
    rest: rest$a
  }));

  behave$t(Multimap);

  var p$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    count: count$d,
    get: get,
    getIn: getIn,
    seq: seq$a,
    first: first$d,
    rest: rest$d,
    second: second$2,
    next: next$a,
    nth: nth$6,
    idx: idx$3,
    equiv: equiv$9,
    alike: alike,
    equivalent: equivalent,
    eq: eq,
    notEq: notEq
  });

  function IndexedSeq(seq, start) {
    this.seq = seq;
    this.start = start;
  }

  function indexedSeq1(seq) {
    return indexedSeq2(seq, 0);
  }

  function indexedSeq2(seq, start) {
    return start < count$d(seq) ? new IndexedSeq(seq, start) : emptyList();
  }

  var indexedSeq = overload(null, indexedSeq1, indexedSeq2);
  IndexedSeq.prototype[_Symbol.toStringTag] = "IndexedSeq";

  function RevSeq(coll, idx) {
    this.coll = coll;
    this.idx = idx;
  }
  function revSeq(coll, idx) {
    return new RevSeq(coll, idx);
  }

  function reverse$2(self) {
    var c = count$9(self);
    return c > 0 ? revSeq(self, c - 1) : null;
  }

  function key$2(self) {
    return lookup$9(self, 0);
  }

  function val$2(self) {
    return lookup$9(self, 1);
  }

  function find$4(self, key) {
    return contains$7(self, key) ? [key, lookup$9(self, key)] : null;
  }

  function contains$7(self, key) {
    return key < count$d(self.seq) - self.start;
  }

  function lookup$9(self, key) {
    return get(self.seq, self.start + key);
  }

  function append$4(self, x) {
    return concat(self, [x]);
  }

  function prepend$4(self, x) {
    return concat([x], self);
  }

  function next$8(self) {
    var pos = self.start + 1;
    return pos < count$d(self.seq) ? indexedSeq(self.seq, pos) : null;
  }

  function nth$4(self, idx) {
    return nth$6(self.seq, idx + self.start);
  }

  function idx2(self, x) {
    return idx3(self, x, 0);
  }

  function idx3(self, x, idx) {
    if (first$9(self) === x) {
      return idx;
    }

    var nxt = next$8(self);
    return nxt ? idx3(nxt, x, idx + 1) : null;
  }

  var idx$1 = overload(null, null, idx2, idx3);

  function first$9(self) {
    return nth$4(self, 0);
  }

  function rest$9(self) {
    return indexedSeq(self.seq, self.start + 1);
  }

  function toArray$5(self) {
    return reduce$9(self, function (memo, x) {
      memo.push(x);
      return memo;
    }, []);
  }

  function count$9(self) {
    return count$d(self.seq) - self.start;
  }

  function reduce$9(self, f, init) {
    var memo = init,
        coll = seq$a(self);

    while (coll && !isReduced(memo)) {
      memo = f(memo, first$d(coll));
      coll = next$a(coll);
    }

    return unreduced(memo);
  }

  function reducekv$7(self, f, init) {
    var idx = 0;
    return reduce$9(self, function (memo, value) {
      memo = f(memo, idx, value);
      idx += 1;
      return memo;
    }, init);
  }

  function includes$7(self, x) {
    var _x, _p$equiv, _p;

    return detect((_p = p$4, _p$equiv = _p.equiv, _x = x, function equiv(_argPlaceholder) {
      return _p$equiv.call(_p, _x, _argPlaceholder);
    }), drop(self.start, self.seq));
  }

  var behave$s = does(iterable, iequiv, implement(ISequential$1), implement(IIndexed, {
    nth: nth$4,
    idx: idx$1
  }), implement(IReversible, {
    reverse: reverse$2
  }), implement(IMapEntry, {
    key: key$2,
    val: val$2
  }), implement(IInclusive, {
    includes: includes$7
  }), implement(IFind, {
    find: find$4
  }), implement(IAssociative, {
    contains: contains$7
  }), implement(IAppendable, {
    append: append$4
  }), implement(IPrependable, {
    prepend: prepend$4
  }), implement(IEmptyableCollection, {
    empty: emptyArray
  }), implement(IReduce, {
    reduce: reduce$9
  }), implement(IKVReduce, {
    reducekv: reducekv$7
  }), implement(IFn, {
    invoke: lookup$9
  }), implement(ILookup, {
    lookup: lookup$9
  }), implement(ICollection, {
    conj: append$4
  }), implement(INext, {
    next: next$8
  }), implement(ICoercible, {
    toArray: toArray$5
  }), implement(ISeq, {
    first: first$9,
    rest: rest$9
  }), implement(ISeqable, {
    seq: identity
  }), implement(ICounted, {
    count: count$9
  }));

  behave$s(IndexedSeq);

  function clone$4(self) {
    return new revSeq(self.coll, self.idx);
  }

  function count$8(self) {
    return count$d(self.coll);
  }

  function keys$8(self) {
    return range(count$8(self));
  }

  function vals$4(self) {
    var _self, _nth;

    return map((_nth = nth$3, _self = self, function nth(_argPlaceholder) {
      return _nth(_self, _argPlaceholder);
    }), keys$8(self));
  }

  function nth$3(self, idx) {
    return nth$6(self.coll, count$8(self) - 1 - idx);
  }

  function first$8(self) {
    return nth$6(self.coll, self.idx);
  }

  function rest$8(self) {
    return next$a(self) || emptyList();
  }

  function next$7(self) {
    return self.idx > 0 ? revSeq(self.coll, self.idx - 1) : null;
  }

  function conj$5(self, value) {
    return cons(value, self);
  }

  function reduce2(coll, f) {
    var xs = seq$a(coll);
    return xs ? reduce$f(f, first$d(xs), next$a(xs)) : f();
  }

  function reduce3(coll, f, init) {
    var memo = init,
        xs = seq$a(coll);

    while (xs) {
      memo = f(memo, first$d(xs));

      if (memo instanceof Reduced) {
        return unreduced(memo);
      }

      xs = next$a(xs);
    }

    return memo;
  }

  var reduce$8 = overload(null, null, reduce2, reduce3);
  var behave$r = does(iterable, implement(ISequential$1), implement(ICounted, {
    count: count$8
  }), implement(IIndexed, {
    nth: nth$3
  }), implement(ILookup, {
    lookup: nth$3
  }), implement(IMap, {
    keys: keys$8,
    vals: vals$4
  }), implement(ICoercible, {
    toArray: Array.from
  }), implement(IEmptyableCollection, {
    empty: emptyList
  }), implement(IReduce, {
    reduce: reduce$8
  }), implement(ICollection, {
    conj: conj$5
  }), implement(ISeq, {
    first: first$8,
    rest: rest$8
  }), implement(INext, {
    next: next$7
  }), implement(ISeqable, {
    seq: identity
  }), implement(IClonable, {
    clone: clone$4
  }));

  behave$r(RevSeq);

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
  var name$1 = INamable.name;
  function type(self) {
    return self == null ? Nil : self.constructor;
  }
  var what1 = post(comp(name$1, type), isSymbol); //e.g. what([], Array) === true

  function what2(self, type) {
    return what1(self) === name$1(type);
  }

  var what = overload(null, what1, what2);
  var naming = pre(function naming(type, symbol) {
    if (!satisfies(INamable, type) || _typeof(name$1(type)) !== "symbol") {
      doto(type, specify(INamable, {
        name: constantly(symbol)
      }));
    }
  }, signature(isFunction, isSymbol));

  var _Symbol2, _naming;

  function _slicedToArray$4(arr, i) { return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$6(arr, i) || _nonIterableRest$4(); }

  function _nonIterableRest$4() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$6(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$6(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen); }

  function _arrayLikeToArray$6(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$4(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$4(arr) { if (Array.isArray(arr)) return arr; }

  function clone$3(self) {
    return slice(self);
  }

  function _before(self, reference, inserted) {
    var pos = self.indexOf(reference);
    pos === -1 || self.splice(pos, 0, inserted);
  }

  function before$1(self, reference, inserted) {
    var arr = Array.from(self);

    _before(arr, reference, inserted);

    return arr;
  }

  function _after(self, reference, inserted) {
    var pos = self.indexOf(reference);
    pos === -1 || self.splice(pos + 1, 0, inserted);
  }

  function after$1(self, reference, inserted) {
    var arr = Array.from(self);

    _after(arr, reference, inserted);

    return arr;
  }

  function keys$7(self) {
    return range(count$7(self));
  }

  function _dissoc(self, idx) {
    self.splice(idx, 1);
  }

  function dissoc$4(self, idx) {
    var arr = Array.from(self);

    _dissoc(arr, idx);

    return arr;
  }

  function reduce$7(xs, f, init) {
    var memo = init,
        to = xs.length - 1;

    for (var i = 0; i <= to; i++) {
      if (isReduced(memo)) break;
      memo = f(memo, xs[i]);
    }

    return unreduced(memo);
  }

  function reducekv$6(xs, f, init) {
    var memo = init,
        len = xs.length;

    for (var i = 0; i < len; i++) {
      if (isReduced(memo)) break;
      memo = f(memo, i, xs[i]);
    }

    return unreduced(memo);
  }

  function omit$1(self, value) {
    return filter(function (x) {
      return x !== value;
    }, self);
  }

  function reverse$1(self) {
    var c = count$7(self);
    return c > 0 ? revSeq(self, c - 1) : null;
  }

  function key$1(self) {
    return self[0];
  }

  function val$1(self) {
    return self[1];
  }

  function find$3(self, key) {
    return contains$6(self, key) ? [key, lookup$8(self, key)] : null;
  }

  function lookup$8(self, key) {
    return key in self ? self[key] : null;
  }

  function assoc$6(self, key, value) {
    if (lookup$8(self, key) === value) {
      return self;
    }

    var arr = Array.from(self);
    arr.splice(key, 1, value);
    return arr;
  }

  function contains$6(self, key) {
    return key > -1 && key < self.length;
  }

  function seq$6(self) {
    return self.length ? self : null;
  }

  function unconj(self, x) {
    var arr = Array.from(self);
    var pos = arr.lastIndexOf(x);
    arr.splice(pos, 1);
    return arr;
  }

  function append$3(self, x) {
    return self.concat([x]);
  }

  function prepend$3(self, x) {
    return [x].concat(self);
  }

  function next$6(self) {
    return self.length > 1 ? rest$7(self) : null;
  }

  function first$7(self) {
    return self[0];
  }

  function rest$7(self) {
    return indexedSeq(self, 1);
  }

  function includes$6(self, x) {
    return self.indexOf(x) > -1;
  }

  function count$7(self) {
    return self.length;
  }

  var nth$2 = lookup$8;

  function idx(self, x) {
    var n = self.indexOf(x);
    return n === -1 ? null : n;
  }

  function toObject$1(self) {
    return reduce$7(self, function (memo, _ref) {
      var _ref2 = _slicedToArray$4(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      memo[key] = value;
      return memo;
    }, {});
  }

  function fmap$9(self, f) {
    return mapa(f, self);
  }

  var blank$3 = complement(seq$6);
  var iindexed = does(implement(IIndexed, {
    nth: nth$2,
    idx: idx
  }), implement(ICounted, {
    count: count$7
  }));
  var behave$q = does((_naming = naming, _Symbol2 = _Symbol("Array"), function naming(_argPlaceholder) {
    return _naming(_argPlaceholder, _Symbol2);
  }), iequiv, iindexed, implement(ISequential$1), implement(IMap, {
    dissoc: dissoc$4,
    keys: keys$7,
    vals: identity
  }), implement(IMergable, {
    merge: concat
  }), implement(IInsertable, {
    before: before$1,
    after: after$1
  }), implement(IFunctor, {
    fmap: fmap$9
  }), implement(ICoercible, {
    toObject: toObject$1,
    toArray: identity
  }), implement(IOmissible, {
    omit: omit$1
  }), implement(IReversible, {
    reverse: reverse$1
  }), implement(IFind, {
    find: find$3
  }), implement(IMapEntry, {
    key: key$1,
    val: val$1
  }), implement(IInclusive, {
    includes: includes$6
  }), implement(IAppendable, {
    append: append$3
  }), implement(IPrependable, {
    prepend: prepend$3
  }), implement(IClonable, {
    clone: clone$3
  }), implement(IFn, {
    invoke: lookup$8
  }), implement(IEmptyableCollection, {
    empty: emptyArray
  }), implement(IReduce, {
    reduce: reduce$7
  }), implement(IKVReduce, {
    reducekv: reducekv$6
  }), implement(ILookup, {
    lookup: lookup$8
  }), implement(IAssociative, {
    assoc: assoc$6,
    contains: contains$6
  }), implement(IBlankable, {
    blank: blank$3
  }), implement(ISeqable, {
    seq: seq$6
  }), implement(ICollection, {
    conj: append$3,
    unconj: unconj
  }), implement(INext, {
    next: next$6
  }), implement(ISeq, {
    first: first$7,
    rest: rest$7
  }));

  Object.assign(behaviors, {
    Array: behave$q
  });
  var iarray = behave$q;
  behave$q(Array);

  function monthDays(self) {
    return patch(self, {
      month: inc,
      day: 0
    }).getDate();
  }
  function weekday(self) {
    return self ? !weekend(self) : null;
  }
  function weekend(self) {
    var day = dow1(self);
    return day == null ? null : day == 0 || day == 6;
  }

  function dow1(self) {
    return self ? self.getDay() : null;
  }

  function dow2(self, n) {
    return self ? dow1(self) === n : null;
  }

  var dow = overload(null, dow1, dow2);
  var year = prop("year");
  var month = prop("month");
  var day = prop("day");
  var hour = prop("hour");
  var minute = prop("minute");
  var second$1 = prop("second");
  var millisecond = prop("millisecond");
  function quarter(self) {
    return Math.ceil((month(self) + 1) / 3);
  }
  function clockHour(self) {
    var h = self.getHours();
    return (h > 12 ? h - 12 : h) || 12;
  }
  function pm(self) {
    return self.getHours() >= 12;
  } //dow = 0-6 if day is in first week.  Add 7 for every additional week.
  //e.g. Second Saturday is 13 (6 + 7), First Sunday is 0, Second Sunday is 7.

  function rdow(self, n) {
    var dt = clone$5(self);

    while (n < 0) {
      dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 7, dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
      n += 7;
    }

    if (n > 6) {
      var dys = Math.floor(n / 7) * 7;
      dt.setDate(dt.getDate() + dys);
      n = n % 7;
    }

    var offset = n - dt.getDay();
    dt.setDate(dt.getDate() + offset + (offset < 0 ? 7 : 0));
    return dt;
  }
  function mdow(self, n) {
    return rdow(patch(self, som()), n);
  }
  function isDate(self) {
    return self instanceof Date && !isNaN(self);
  }
  function time(hour, minute, second, millisecond) {
    return {
      hour: hour || 0,
      minute: minute || 0,
      second: second || 0,
      millisecond: millisecond || 0
    };
  }
  function sod() {
    return time(0, 0, 0, 0);
  }
  function eod() {
    return {
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      day: inc
    };
  }
  function noon() {
    return time(12, 0, 0, 0);
  }
  function annually(month, day) {
    return {
      month: month,
      day: day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  var midnight = sod;
  function som() {
    return {
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function eom() {
    return {
      month: inc,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function soy() {
    return {
      month: 0,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function eoy() {
    return {
      year: inc,
      month: 0,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function tick(n) {
    return {
      millisecond: n
    };
  }
  function untick() {
    return tick(dec);
  }

  function _slicedToArray$3(arr, i) { return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$5(arr, i) || _nonIterableRest$3(); }

  function _nonIterableRest$3() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$5(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$5(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen); }

  function _arrayLikeToArray$5(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$3(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$3(arr) { if (Array.isArray(arr)) return arr; }
  var start$2 = IBounds.start;
  var end$2 = IBounds.end;

  function chronology(item) {
    var s = start$2(item),
        e = end$2(item);
    return s == null || e == null ? [s, e] : [s, e].sort(compare$6);
  } //The end range value must also be the start range value of the next successive range to avoid infinitisimally small gaps.
  //As such, the end range value cannot itself be considered part of a range, for if it did that value would nonsensically belong to two successive ranges.


  function inside(sr, er, b) {
    if (b == null) {
      return false;
    }

    if (sr == null && er == null) {
      return true;
    }

    return (sr == null || compare$6(b, sr) >= 0) && (er == null || compare$6(b, er) < 0);
  }
  function between(a, b) {
    var _chronology = chronology(a),
        _chronology2 = _slicedToArray$3(_chronology, 2),
        sa = _chronology2[0],
        ea = _chronology2[1],
        _chronology3 = chronology(b),
        _chronology4 = _slicedToArray$3(_chronology3, 2),
        sb = _chronology4[0],
        eb = _chronology4[1];

    return inside(sa, ea, sb) && inside(sa, ea, eb);
  }
  function overlap(self, other) {
    var make = constructs(self.constructor),
        ss = start$2(self),
        es = end$2(self),
        so = start$2(other),
        eo = end$2(other),
        sn = isNil(ss) || isNil(so) ? ss || so : gt(ss, so) ? ss : so,
        en = isNil(es) || isNil(eo) ? es || eo : lt(es, eo) ? es : eo;
    return lte(sn, en) ? make(sn, en) : null;
  }

  var divide$2 = overload(null, identity, IDivisible.divide, reducing(IDivisible.divide));

  var p$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    start: start$2,
    end: end$2,
    inside: inside,
    between: between,
    overlap: overlap,
    directed: directed,
    steps: steps,
    subtract: subtract,
    add: add$3,
    inc: inc,
    dec: dec,
    divide: divide$2,
    toArray: toArray$7,
    toObject: toObject$3,
    toPromise: toPromise,
    toDuration: toDuration$1,
    compare: compare$6,
    lt: lt,
    lte: lte,
    gt: gt,
    gte: gte,
    equiv: equiv$9,
    alike: alike,
    equivalent: equivalent,
    eq: eq,
    notEq: notEq
  });

  function Period(start, end) {
    this.start = start;
    this.end = end;
  }
  function emptyPeriod() {
    return new Period();
  }
  function period1(obj) {
    return period2(patch(obj, sod()), patch(obj, eod()));
  }

  function period2(start, end) {
    //end could be a duration (e.g. `minutes(30)`).
    var pd = new Period(start, end == null || isDate(end) ? end : add$3(start, end));

    if (!(pd.start == null || isDate(pd.start))) {
      throw new Error("Invalid start of period.");
    }

    if (!(pd.end == null || isDate(pd.end))) {
      throw new Error("Invalid end of period.");
    }

    if (pd.start != null && pd.end != null && pd.start > pd.end) {
      throw new Error("Period bounds must be chronological.");
    }

    return pd;
  }

  var period = overload(emptyPeriod, period1, period2);
  Period.prototype[_Symbol.toStringTag] = "Period";

  function Benchmark(operation, result, period, duration) {
    this.operation = operation;
    this.result = result;
    this.period = period;
    this.duration = duration;
  }

  function benchmark1(operation) {
    var start = new Date();
    return Promise$1.resolve(operation()).then(function (result) {
      var end = new Date();
      return new Benchmark(operation, result, period(start, end), end - start);
    });
  }

  function benchmark2(n, operation) {
    return benchmark3(n, operation, []).then(function (xs) {
      return sort(asc(duration$1), xs);
    }).then(function (xs) {
      return Object.assign({
        source: xs,
        operation: first$d(xs).operation
      }, measure(mapa(duration$1, xs)));
    });
  }

  function benchmark3(n, operation, benchmarked) {
    return n ? benchmark1(operation).then(function (bm) {
      return benchmark3(n - 1, operation, benchmarked.concat(bm));
    }) : benchmarked;
  }

  var benchmark = overload(null, benchmark1, benchmark2);

  function duration$1(x) {
    return x.duration;
  }

  function _slicedToArray$2(arr, i) { return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$4(arr, i) || _nonIterableRest$2(); }

  function _nonIterableRest$2() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }

  function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$2(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$2(arr) { if (Array.isArray(arr)) return arr; }

  function race1(operations) {
    return race2(10, operations);
  }

  function race2(n, operations) {
    return race3(n, operations, []).then(function (measures) {
      return sort(asc(average), asc(most), measures);
    });
  }

  function race3(n, operations, measures) {
    return Promise$1.all([measures, benchmark(n, first$d(operations))]).then(function (_ref) {
      var _ref2 = _slicedToArray$2(_ref, 2),
          xs = _ref2[0],
          x = _ref2[1];

      var measures = xs.concat(x);
      return next$a(operations) ? race3(n, next$a(operations), measures) : measures;
    });
  }

  var race = overload(null, race1, race2, race3);

  function average(x) {
    return x.average;
  }

  function most(x) {
    return x.most;
  }

  function start$1(self) {
    return start$2(self.period);
  }

  function end$1(self) {
    return end$2(self.period);
  }

  var behave$p = does(implement(IBounds, {
    start: start$1,
    end: end$1
  }));

  behave$p(Benchmark);

  function conj$4(self, x) {
    return new self.constructor(conj$8(self.colls, [x]));
  }

  function next$5(self) {
    var tail = rest$d(self);
    return seq$a(tail) ? tail : null;
  }

  function first$6(self) {
    return first$d(first$d(self.colls));
  }

  function rest$6(self) {
    return apply(concat, rest$d(first$d(self.colls)), rest$d(self.colls));
  }

  function toArray$4(self) {
    return reduce$6(self, function (memo, value) {
      memo.push(value);
      return memo;
    }, []);
  }

  function reduce$6(self, f, init) {
    var memo = init,
        remaining = self;

    while (!isReduced(memo) && seq$a(remaining)) {
      memo = f(memo, first$d(remaining));
      remaining = next$a(remaining);
    }

    return unreduced(memo);
  }

  function reducekv$5(self, f, init) {
    var memo = init,
        remaining = self,
        idx = 0;

    while (!isReduced(memo) && seq$a(remaining)) {
      memo = f(memo, idx, first$d(remaining));
      remaining = next$a(remaining);
      idx++;
    }

    return unreduced(memo);
  }

  function count$6(self) {
    return reduce$6(self, function (memo, value) {
      return memo + 1;
    }, 0);
  }

  var behave$o = does(iterable, implement(IReduce, ilazyseq), implement(IKVReduce, ilazyseq), implement(ISequential$1), implement(IEmptyableCollection, {
    empty: emptyList
  }), implement(IKVReduce, {
    reducekv: reducekv$5
  }), //TODO!!
  implement(IReduce, {
    reduce: reduce$6
  }), //TODO!!
  implement(ICollection, {
    conj: conj$4
  }), implement(INext, {
    next: next$5
  }), implement(ISeq, {
    first: first$6,
    rest: rest$6
  }), implement(ICoercible, {
    toArray: toArray$4
  }), implement(ISeqable, {
    seq: identity
  }), implement(ICounted, {
    count: count$6
  }));

  behave$o(Concatenated);

  function date7(year, month, day, hour, minute, second, millisecond) {
    return new Date(year, month || 0, day || 1, hour || 0, minute || 0, second || 0, millisecond || 0);
  }

  var create = constructs(Date);
  var date = overload(create, create, date7);
  Date.prototype[_Symbol.toStringTag] = "Date";

  var _mult;
  function Duration(units) {
    this.units = units;
  }

  function valueOf() {
    var units = this.units;
    return (units.year || 0) * 1000 * 60 * 60 * 24 * 365.25 + (units.month || 0) * 1000 * 60 * 60 * 24 * 30.4375 + (units.day || 0) * 1000 * 60 * 60 * 24 + (units.hour || 0) * 1000 * 60 * 60 + (units.minute || 0) * 1000 * 60 + (units.second || 0) * 1000 + (units.millisecond || 0);
  }

  function unit(key) {
    return function (n) {
      return new Duration(assoc$a({}, key, n));
    };
  }

  var years = unit("year");
  var months = unit("month");
  var days = unit("day");
  var hours = unit("hour");
  var minutes = unit("minute");
  var seconds = unit("second");
  var milliseconds = unit("millisecond");
  var duration = overload(null, branch(isNumber, milliseconds, constructs(Duration)), function (start, end) {
    return milliseconds(end - start);
  });
  var weeks = comp(days, (_mult = mult$2, function mult(_argPlaceholder) {
    return _mult(_argPlaceholder, 7);
  }));
  Duration.prototype[_Symbol.toStringTag] = "Duration";
  Duration.prototype.valueOf = valueOf;
  Duration.units = ["year", "month", "day", "hour", "minute", "second", "millisecond"];

  function reducekv$4(self, f, init) {
    return reduce$f(function (memo, key) {
      return f(memo, key, lookup$7(self, key));
    }, init, keys$6(self));
  }

  var merge$2 = partial(mergeWith, add$3);

  function mult(self, n) {
    return fmap$8(self, function (value) {
      return value * n;
    });
  }

  function fmap$8(self, f) {
    return new self.constructor(reducekv$4(self, function (memo, key, value) {
      return assoc$a(memo, key, f(value));
    }, {}));
  }

  function keys$6(self) {
    return keys$b(self.units);
  }

  function dissoc$3(self, key) {
    return new self.constructor(dissoc$6(self.units, key));
  }

  function lookup$7(self, key) {
    if (!includes$9(Duration.units, key)) {
      throw new Error("Invalid unit.");
    }

    return get(self.units, key);
  }

  function contains$5(self, key) {
    return contains$a(self.units, key);
  }

  function assoc$5(self, key, value) {
    if (!includes$9(Duration.units, key)) {
      throw new Error("Invalid unit.");
    }

    return new self.constructor(assoc$a(self.units, key, value));
  }

  function divide$1(a, b) {
    return a.valueOf() / b.valueOf();
  }

  var behave$n = does(implement(IKVReduce, {
    reducekv: reducekv$4
  }), implement(IAddable, {
    add: merge$2
  }), implement(IMergable, {
    merge: merge$2
  }), implement(IFunctor, {
    fmap: fmap$8
  }), implement(IAssociative, {
    assoc: assoc$5,
    contains: contains$5
  }), implement(ILookup, {
    lookup: lookup$7
  }), implement(IMap, {
    keys: keys$6,
    dissoc: dissoc$3
  }), implement(IDivisible, {
    divide: divide$1
  }), implement(IMultipliable, {
    mult: mult
  }), implement(ICoercible, {
    toDuration: identity
  }));

  behave$n(Duration);

  function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest$1(); }

  function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

  function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit$1(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }

  function add$1(self, other) {
    return mergeWith(add$3, self, isNumber(other) ? days(other) : other);
  }

  function lookup$6(self, key) {
    switch (key) {
      case "year":
        return self.getFullYear();

      case "month":
        return self.getMonth();

      case "day":
        return self.getDate();

      case "hour":
        return self.getHours();

      case "minute":
        return self.getMinutes();

      case "second":
        return self.getSeconds();

      case "millisecond":
        return self.getMilliseconds();
    }
  }

  function InvalidKeyError(key, target) {
    this.key = key;
    this.target = target;
  }

  function contains$4(self, key) {
    return keys$5().indexOf(key) > -1;
  }

  function keys$5(self) {
    return ["year", "month", "day", "hour", "minute", "second", "millisecond"];
  }

  function vals$3(self) {
    return reduce$f(function (memo, key) {
      memo.push(get(self, key));
      return memo;
    }, [], keys$5());
  }

  function conj$3(self, _ref) {
    var _ref2 = _slicedToArray$1(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return assoc$4(self, key, value);
  } //the benefit of exposing internal state as a map is assocIn and updateIn


  function assoc$4(self, key, value) {
    var dt = new Date(self.valueOf());

    switch (key) {
      case "year":
        dt.setFullYear(value);
        break;

      case "month":
        dt.setMonth(value);
        break;

      case "day":
        dt.setDate(value);
        break;

      case "hour":
        dt.setHours(value);
        break;

      case "minute":
        dt.setMinutes(value);
        break;

      case "second":
        dt.setSeconds(value);
        break;

      case "millisecond":
        dt.setMilliseconds(value);
        break;

      default:
        throw new InvalidKeyError(key, self);
    }

    return dt;
  }

  function clone$2(self) {
    return new Date(self.valueOf());
  }

  function equiv$5(self, other) {
    return other != null && deref$6(self) === deref$8(other);
  }

  function compare$3(self, other) {
    return other == null ? -1 : deref$6(self) - deref$8(other);
  }

  function reduce$5(self, f, init) {
    return reduce$f(function (memo, key) {
      var value = get(self, key);
      return f(memo, [key, value]);
    }, init, keys$5());
  }

  function reducekv$3(self, f, init) {
    return reduce$5(self, function (memo, _ref3) {
      var _ref4 = _slicedToArray$1(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return f(memo, key, value);
    }, init);
  }

  function deref$6(self) {
    return self.valueOf();
  }

  var behave$m = does(implement(IAddable, {
    add: add$1
  }), implement(IDeref, {
    deref: deref$6
  }), implement(IBounds, {
    start: identity,
    end: identity
  }), implement(ISeqable, {
    seq: identity
  }), implement(IReduce, {
    reduce: reduce$5
  }), implement(IKVReduce, {
    reducekv: reducekv$3
  }), implement(IEquiv, {
    equiv: equiv$5
  }), implement(IMap, {
    keys: keys$5,
    vals: vals$3
  }), implement(IComparable, {
    compare: compare$3
  }), implement(ICollection, {
    conj: conj$3
  }), implement(IAssociative, {
    assoc: assoc$4,
    contains: contains$4
  }), implement(ILookup, {
    lookup: lookup$6
  }), implement(IClonable, {
    clone: clone$2
  }));

  Object.assign(behaviors, {
    Date: behave$m
  });
  behave$m(Date);

  function error(message) {
    return new Error(message);
  }
  function isError(self) {
    return self && self instanceof Error;
  }

  function fork$7(self, reject, resolve) {
    return reject(self);
  }

  var behave$l = does(implement(IForkable, {
    fork: fork$7
  }), implement(IFunctor, {
    fmap: identity
  }));

  behave$l(Error);

  function Fluent(value) {
    this.value = value;
  }

  function fluent1(value) {
    return new Fluent(value);
  }

  var fluent = overload(null, fluent1, partial(thrush, fluent1));

  function fmap$7(self, f) {
    return fluent(f(self.value) || self.value);
  }

  function deref$5(self) {
    return self.value;
  }

  var behave$k = does(implement(IDeref, {
    deref: deref$5
  }), implement(IFunctor, {
    fmap: fmap$7
  }));

  behave$k(Fluent);

  function FiniteStateMachine(state, transitions) {
    this.state = state;
    this.transitions = transitions;
  }
  function fsm(state, transitions) {
    return new FiniteStateMachine(state, transitions);
  }

  function equiv$4(self, other) {
    return state$1(self) === state$1(other) && self.transitions === other.transitions;
  }

  function state$1(self) {
    return self.state;
  }

  function transitions$1(self) {
    return keys$b(self.transitions[self.state]);
  }

  function transition$1(self, event) {
    var _param, _getIn, _self$transitions, _fsm;

    return maybe(self.transitions, (_getIn = getIn, _param = [self.state, event], function getIn(_argPlaceholder) {
      return _getIn(_argPlaceholder, _param);
    }), (_fsm = fsm, _self$transitions = self.transitions, function fsm(_argPlaceholder2) {
      return _fsm(_argPlaceholder2, _self$transitions);
    })) || self;
  }

  var behave$j = does(implement(IEquiv, {
    equiv: equiv$4
  }), implement(IStateMachine, {
    state: state$1,
    transition: transition$1,
    transitions: transitions$1
  }));

  behave$j(FiniteStateMachine);

  Function.prototype[_Symbol.toStringTag] = "Function";

  function append$2(f) {
    for (var _len = arguments.length, applied = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      applied[_key - 1] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return f.apply(this, args.concat(applied));
    };
  }

  function invoke$1(self) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return self.apply(null, args);
  }

  function name(self) {
    return self.name ? self.name : get(/function (.+)\s?\(/.exec(self.toString()), 1); //latter is for IE
  }

  var behave$i = does(implement(INamable, {
    name: name
  }), implement(IAppendable, {
    append: append$2
  }), implement(IPrependable, {
    prepend: partial
  }), implement(IFn, {
    invoke: invoke$1
  }));

  behave$i(Function);

  function GUID(id) {
    this.id = id;
  }
  GUID.prototype[_Symbol.toStringTag] = "GUID";

  GUID.prototype.toString = function () {
    return this.id;
  };

  function s4() {
    return Math.floor((1 + rand()) * 0x10000).toString(16).substring(1);
  }

  function guid1(id) {
    return new GUID(id);
  }

  function guid0() {
    return guid1(s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
  }

  var guid = overload(guid0, guid1);
  function isGUID(self) {
    return self && self.constructor === GUID;
  }

  function equiv$3(self, other) {
    return other && other.constructor === self.constructor && self.id === other.id;
  }

  var behave$h = does(implement(IEquiv, {
    equiv: equiv$3
  }));

  behave$h(GUID);

  function Indexed(obj) {
    this.obj = obj;
  }
  function indexed(obj) {
    return new Indexed(obj);
  }

  function count$5(self) {
    return self.obj.length;
  }

  function nth$1(self, idx) {
    return self.obj[idx];
  }

  function first$5(self) {
    return nth$1(self, 0);
  }

  function rest$5(self) {
    return next$4(self) || emptyList();
  }

  function next$4(self) {
    return count$5(self) > 1 ? indexedSeq(self, 1) : null;
  }

  function seq$5(self) {
    return count$5(self) ? self : null;
  }

  function includes$5(self, value) {
    return !!some$1(function (x) {
      return x === value;
    }, self);
  }

  var behave$g = does(iterable, implement(IReduce, ilazyseq), implement(IKVReduce, ilazyseq), implement(ISequential$1), implement(IInclusive, {
    includes: includes$5
  }), implement(IIndexed, {
    nth: nth$1
  }), implement(ILookup, {
    lookup: nth$1
  }), implement(INext, {
    next: next$4
  }), implement(ICoercible, {
    toArray: Array.from
  }), implement(ISeq, {
    first: first$5,
    rest: rest$5
  }), implement(ISeqable, {
    seq: seq$5
  }), implement(ICounted, {
    count: count$5
  }));

  behave$g(Indexed);

  function Journal(pos, max, history, state) {
    this.pos = pos;
    this.max = max;
    this.history = history;
    this.state = state;
  }

  function journal2(max, state) {
    return new Journal(0, max, [state], state);
  }

  function journal1(state) {
    return journal2(Infinity, state);
  }

  var journal = overload(null, journal1, journal2);

  var append$1 = overload(null, identity, IAppendable.append, reducing(IAppendable.append));

  var blank$2 = IBlankable.blank;
  function blot(self) {
    return blank$2(self) ? null : self;
  }

  var chain$1 = IChainable.chain;

  function compact$1(self) {
    return satisfies(ICompactible, self) ? ICompactible.compact(self) : filter(identity, self);
  }
  var only = unspread(compact$1);

  var dispose = IDisposable.dispose;

  var empty$1 = IEmptyableCollection.empty;

  var find$2 = IFind.find;

  var invoke = IFn.invoke;

  function fork2(self, resolve) {
    return IForkable.fork(self, noop, resolve);
  }

  var fork$6 = overload(null, null, fork2, IForkable.fork);

  var handles = IHandler.handles;

  var path$1 = IPath.path;

  function Lens(root, path) {
    this.root = root;
    this.path = path;
  }
  function lens(root, path) {
    return new Lens(root, path || []);
  }

  var _juxt, _map;
  function downward(f) {
    return function down(self) {
      var xs = f(self),
          ys = mapcat(down, xs);
      return concat(xs, ys);
    };
  }
  function upward(f) {
    return function up(self) {
      var other = f(self);
      return other ? cons(other, up(other)) : emptyList();
    };
  }
  var root$2 = IHierarchy.root;
  var parent$1 = IHierarchy.parent;
  var parents$2 = IHierarchy.parents;
  var closest$2 = IHierarchy.closest;
  var ancestors = IHierarchy.parents;
  var children$1 = IHierarchy.children;
  var descendants$1 = IHierarchy.descendants;
  var nextSibling$2 = IHierarchy.nextSibling;
  var prevSibling$2 = IHierarchy.prevSibling;
  var nextSiblings$2 = IHierarchy.nextSiblings;
  var prevSiblings$2 = IHierarchy.prevSiblings;
  var siblings$2 = IHierarchy.siblings;
  function leaves(self) {
    return remove$1(comp(count$d, children$1), descendants$1(self));
  }
  var asLeaves = comp((_map = map, _juxt = juxt(path$1, deref$8), function map(_argPlaceholder) {
    return _map(_juxt, _argPlaceholder);
  }), leaves, lens);

  var identifier = IIdentifiable.identifier;

  function afterN(self) {
    var ref = self;

    for (var _len = arguments.length, els = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      els[_key - 1] = arguments[_key];
    }

    while (els.length) {
      var el = els.shift();
      IInsertable.after(ref, el);
      ref = el;
    }
  }

  var after = overload(null, identity, IInsertable.after, afterN);

  function beforeN(self) {
    var ref = self;

    for (var _len2 = arguments.length, els = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      els[_key2 - 1] = arguments[_key2];
    }

    while (els.length) {
      var el = els.pop();
      IInsertable.before(ref, el);
      ref = el;
    }
  }

  var before = overload(null, identity, IInsertable.before, beforeN);

  var key = IMapEntry.key;
  var val = IMapEntry.val;

  function isRegExp(self) {
    return self.constructor === RegExp;
  }

  function checkPattern(_, pattern) {
    return isString(pattern) || isRegExp(pattern);
  }

  var matches$1 = pre(IMatchable.matches, checkPattern);

  var otherwise$3 = IOtherwise.otherwise;

  var prepend$2 = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend, reverse$4));

  var reset$1 = IReset.reset;

  var undo$1 = IRevertible.undo;
  var undoable$1 = IRevertible.undoable;
  var redo$1 = IRevertible.redo;
  var redoable$1 = IRevertible.redoable;
  var flush$1 = IRevertible.flush;

  var send = ISend.send;

  var _ISet$unite, _reduce;
  var disj = overload(null, identity, ISet.disj, reducing(ISet.disj));
  var union2 = (_reduce = reduce$f, _ISet$unite = ISet.unite, function reduce(_argPlaceholder, _argPlaceholder2) {
    return _reduce(_ISet$unite, _argPlaceholder, _argPlaceholder2);
  });

  function intersection2(xs, ys) {
    return reduce$f(function (memo, x) {
      return includes$9(ys, x) ? conj$8(memo, x) : memo;
    }, empty$1(xs), xs);
  }

  function difference2(xs, ys) {
    return reduce$f(function (memo, x) {
      return includes$9(ys, x) ? memo : conj$8(memo, x);
    }, empty$1(xs), xs);
  }

  function subset(self, other) {
    var _other, _includes;

    return every((_includes = includes$9, _other = other, function includes(_argPlaceholder3) {
      return _includes(_other, _argPlaceholder3);
    }), self);
  }
  function superset(self, other) {
    return subset(other, self);
  }
  var unite = overload(null, null, ISet.unite, reducing(ISet.unite));
  var union = overload(null, identity, union2, reducing(union2));
  var intersection = overload(null, null, intersection2, reducing(intersection2));
  var difference = overload(null, null, difference2, reducing(difference2));

  var state = IStateMachine.state;
  var transition = IStateMachine.transition;
  var transitions = IStateMachine.transitions;

  var split$2 = ISplittable.split;

  function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$1(); }

  function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

  function _iterableToArray$1(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$2(arr); }

  function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function swap3(self, f, a) {
    return ISwap.swap(self, function (state) {
      return f(state, a);
    });
  }

  function swap4(self, f, a, b) {
    return ISwap.swap(self, function (state) {
      return f(state, a, b);
    });
  }

  function swapN(self, f, a, b, cs) {
    return ISwap.swap(self, function (state) {
      return f.apply(null, [state, a, b].concat(_toConsumableArray$1(cs)));
    });
  }

  var swap$1 = overload(null, null, ISwap.swap, swap3, swap4, swapN);

  var fill$2 = ITemplate.fill;
  function template(self) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return fill$2(self, args);
  }

  var p$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    directed: directed,
    steps: steps,
    subtract: subtract,
    add: add$3,
    inc: inc,
    dec: dec,
    append: append$1,
    assoc: assoc$a,
    assocIn: assocIn,
    update: update,
    contains: contains$a,
    updateIn: updateIn,
    rewrite: rewrite,
    prop: prop,
    patch: patch,
    blank: blank$2,
    blot: blot,
    start: start$2,
    end: end$2,
    inside: inside,
    between: between,
    overlap: overlap,
    chain: chain$1,
    clone: clone$5,
    toArray: toArray$7,
    toObject: toObject$3,
    toPromise: toPromise,
    toDuration: toDuration$1,
    conj: conj$8,
    unconj: unconj$1,
    compact: compact$1,
    only: only,
    compare: compare$6,
    lt: lt,
    lte: lte,
    gt: gt,
    gte: gte,
    inverse: inverse$1,
    count: count$d,
    deref: deref$8,
    dispose: dispose,
    divide: divide$2,
    empty: empty$1,
    equiv: equiv$9,
    alike: alike,
    equivalent: equivalent,
    eq: eq,
    notEq: notEq,
    find: find$2,
    invoke: invoke,
    fork: fork$6,
    fmap: fmap$b,
    thrush: thrush,
    pipeline: pipeline,
    handles: handles,
    downward: downward,
    upward: upward,
    root: root$2,
    parent: parent$1,
    parents: parents$2,
    closest: closest$2,
    ancestors: ancestors,
    children: children$1,
    descendants: descendants$1,
    nextSibling: nextSibling$2,
    prevSibling: prevSibling$2,
    nextSiblings: nextSiblings$2,
    prevSiblings: prevSiblings$2,
    siblings: siblings$2,
    leaves: leaves,
    asLeaves: asLeaves,
    identifier: identifier,
    nth: nth$6,
    idx: idx$3,
    includes: includes$9,
    excludes: excludes,
    transpose: transpose,
    after: after,
    before: before,
    reducekv2: reducekv2,
    reducekv3: reducekv3,
    reducekv: reducekv$b,
    get: get,
    getIn: getIn,
    keys: keys$b,
    vals: vals$6,
    dissoc: dissoc$6,
    key: key,
    val: val,
    matches: matches$1,
    merge: merge$4,
    mult: mult$2,
    name: name$1,
    type: type,
    what: what,
    naming: naming,
    next: next$a,
    otherwise: otherwise$3,
    path: path$1,
    prepend: prepend$2,
    reduce: reduce$f,
    reducing: reducing,
    reset: reset$1,
    reverse: reverse$4,
    undo: undo$1,
    undoable: undoable$1,
    redo: redo$1,
    redoable: redoable$1,
    flush: flush$1,
    send: send,
    first: first$d,
    rest: rest$d,
    second: second$2,
    seq: seq$a,
    disj: disj,
    subset: subset,
    superset: superset,
    unite: unite,
    union: union,
    intersection: intersection,
    difference: difference,
    state: state,
    transition: transition,
    transitions: transitions,
    split: split$2,
    swap: swap$1,
    fill: fill$2,
    template: template,
    omit: omit$3
  });

  function undo(self) {
    return undoable(self) ? new Journal(self.pos + 1, self.max, self.history, self.state) : self;
  }

  function redo(self) {
    return redoable(self) ? new Journal(self.pos - 1, self.max, self.history, self.state) : self;
  }

  function flush(self) {
    return new Journal(0, self.max, [self.state], self.state);
  }

  function undoable(self) {
    return self.pos < count$d(self.history);
  }

  function redoable(self) {
    return self.pos > 0;
  }

  function assoc$3(self, key, value) {
    var _key, _value, _p$assoc, _p;

    return fmap$6(self, (_p = p$2, _p$assoc = _p.assoc, _key = key, _value = value, function assoc(_argPlaceholder) {
      return _p$assoc.call(_p, _argPlaceholder, _key, _value);
    }));
  }

  function contains$3(self, key) {
    return contains$a(nth$6(self.history, self.pos), key);
  }

  function lookup$5(self, key) {
    return get(nth$6(self.history, self.pos), key);
  }

  function deref$4(self) {
    return self.state;
  }

  function fmap$6(self, f) {
    var revised = f(self.state);
    return new Journal(0, self.max, prepend$2(self.pos ? slice(self.history, self.pos) : self.history, revised), revised);
  }

  var behave$f = does(implement(IDeref, {
    deref: deref$4
  }), implement(IFunctor, {
    fmap: fmap$6
  }), implement(ILookup, {
    lookup: lookup$5
  }), implement(IAssociative, {
    assoc: assoc$3,
    contains: contains$3
  }), implement(IRevertible, {
    undo: undo,
    redo: redo,
    flush: flush,
    undoable: undoable,
    redoable: redoable
  }));

  behave$f(Journal);

  function Left(value) {
    this.value = value;
  }
  function left1(value) {
    return new Left(value);
  }
  var left = overload(null, left1, partial(thrush, left1));
  function isLeft(self) {
    return self instanceof Left;
  }

  var fmap$5 = identity;

  function fork$5(self, reject, resolve) {
    return reject(self.value);
  }

  function deref$3(self) {
    return self.value;
  }

  var behave$e = does(implement(IDeref, {
    deref: deref$3
  }), implement(IForkable, {
    fork: fork$5
  }), implement(IFunctor, {
    fmap: fmap$5
  }));

  behave$e(Left);

  var p$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    keys: keys$b,
    vals: vals$6,
    dissoc: dissoc$6,
    assoc: assoc$a,
    assocIn: assocIn,
    update: update,
    contains: contains$a,
    updateIn: updateIn,
    rewrite: rewrite,
    prop: prop,
    patch: patch,
    seq: seq$a,
    get: get,
    getIn: getIn,
    includes: includes$9,
    excludes: excludes,
    transpose: transpose,
    first: first$d,
    rest: rest$d,
    second: second$2,
    toArray: toArray$7,
    toObject: toObject$3,
    toPromise: toPromise,
    toDuration: toDuration$1,
    reverse: reverse$4,
    downward: downward,
    upward: upward,
    root: root$2,
    parent: parent$1,
    parents: parents$2,
    closest: closest$2,
    ancestors: ancestors,
    children: children$1,
    descendants: descendants$1,
    nextSibling: nextSibling$2,
    prevSibling: prevSibling$2,
    nextSiblings: nextSiblings$2,
    prevSiblings: prevSiblings$2,
    siblings: siblings$2,
    leaves: leaves,
    asLeaves: asLeaves,
    conj: conj$8,
    unconj: unconj$1,
    clone: clone$5
  });

  function path(self) {
    return self.path;
  }

  function deref$2(self) {
    return getIn(self.root, self.path);
  }

  function conj$2(self, value) {
    var _value, _p$conj, _p;

    return swap(self, (_p = p$1, _p$conj = _p.conj, _value = value, function conj(_argPlaceholder) {
      return _p$conj.call(_p, _argPlaceholder, _value);
    }));
  }

  function lookup$4(self, key) {
    return Object.assign(clone$5(self), {
      path: conj$8(self.path, key)
    });
  }

  function assoc$2(self, key, value) {
    var _key, _value2, _p$assoc, _p2;

    return swap(self, (_p2 = p$1, _p$assoc = _p2.assoc, _key = key, _value2 = value, function assoc(_argPlaceholder2) {
      return _p$assoc.call(_p2, _argPlaceholder2, _key, _value2);
    }));
  }

  function contains$2(self, key) {
    return includes$9(keys$4(self), key);
  }

  function dissoc$2(self, key) {
    var _key2, _p$dissoc, _p3;

    return swap(self, (_p3 = p$1, _p$dissoc = _p3.dissoc, _key2 = key, function dissoc(_argPlaceholder3) {
      return _p$dissoc.call(_p3, _argPlaceholder3, _key2);
    }));
  }

  function reset(self, value) {
    return Object.assign(clone$5(self), {
      root: assocIn(self.root, self.path, value)
    });
  }

  function swap(self, f) {
    return Object.assign(clone$5(self), {
      root: updateIn(self.root, self.path, f)
    });
  }

  function root$1(self) {
    return Object.assign(clone$5(self), {
      path: []
    });
  }

  function children(self) {
    return map(function (key) {
      return Object.assign(clone$5(self), {
        path: conj$8(self.path, key)
      });
    }, keys$4(self));
  }

  function keys$4(self) {
    var value = deref$2(self);
    return satisfies(IMap, value) ? keys$b(value) : emptyList();
  }

  function vals$2(self) {
    var _value3, _p$get, _p4;

    var value = deref$2(self);
    return map((_p4 = p$1, _p$get = _p4.get, _value3 = value, function get(_argPlaceholder4) {
      return _p$get.call(_p4, _value3, _argPlaceholder4);
    }), keys$4(self));
  }

  function siblings$1(self) {
    var p = parent(self),
        ctx = p.toArray(butlast(self.path)),
        key = last(self.path);
    return map(function (key) {
      return Object.assign(p.clone(self), {
        path: p.conj(ctx, key)
      });
    }, remove$1(function (k) {
      return k === key;
    }, p ? keys$4(p) : []));
  }

  function prevSiblings$1(self) {
    var p = parent(self),
        ctx = p.toArray(butlast(self.path)),
        key = last(self.path);
    return map(function (key) {
      return Object.assign(p.clone(self), {
        path: p.conj(ctx, key)
      });
    }, p.reverse(p.toArray(take(1, takeWhile(function (k) {
      return k !== key;
    }, p ? keys$4(p) : [])))));
  }

  function nextSiblings$1(self) {
    var p = parent(self),
        ctx = p.toArray(butlast(self.path)),
        key = last(self.path);
    return map(function (key) {
      return Object.assign(p.clone(self), {
        path: p.conj(ctx, key)
      });
    }, drop(1, dropWhile(function (k) {
      return k !== key;
    }, p ? keys$4(p) : [])));
  }

  var prevSibling$1 = comp(first$d, prevSiblings$1);
  var nextSibling$1 = comp(first$d, nextSiblings$1);

  function parent(self) {
    return seq$a(self.path) ? Object.assign(clone$5(self), {
      path: butlast(self.path)
    }) : null;
  }

  function parents$1(self) {
    return lazySeq(function () {
      var p = parent(self);
      return p ? cons(p, parents$1(p)) : emptyList();
    });
  }

  function closest$1(self, pred) {
    return detect(comp(pred, deref$2), cons(self, parents$1(self)));
  }

  var descendants = downward(children);
  var behave$d = does(implement(IPath, {
    path: path
  }), implement(ICollection, {
    conj: conj$2
  }), implement(ILookup, {
    lookup: lookup$4
  }), implement(IAssociative, {
    assoc: assoc$2,
    contains: contains$2
  }), implement(IMap, {
    keys: keys$4,
    vals: vals$2,
    dissoc: dissoc$2
  }), implement(ISwap, {
    swap: swap
  }), implement(IReset, {
    reset: reset
  }), implement(IHierarchy, {
    root: root$1,
    children: children,
    parents: parents$1,
    parent: parent,
    closest: closest$1,
    descendants: descendants,
    siblings: siblings$1,
    nextSiblings: nextSiblings$1,
    nextSibling: nextSibling$1,
    prevSiblings: prevSiblings$1,
    prevSibling: prevSibling$1
  }), implement(IDeref, {
    deref: deref$2
  }));

  behave$d(Lens);

  function first$4(self) {
    return self.head;
  }

  function rest$4(self) {
    return self.tail;
  }

  var behave$c = does(ilazyseq, implement(ISeqable, {
    seq: identity
  }), implement(ISeq, {
    first: first$4,
    rest: rest$4
  }));

  behave$c(List);

  function fmap$4(self, f) {
    return self.value == null ? self : maybe(f(self.value));
  }

  function otherwise$2(self, other) {
    return self.value == null ? other : self.value;
  }

  function fork$4(self, reject, resolve) {
    return resolve(self.value == null ? null : self.value);
  }

  function deref$1(self) {
    return self.value == null ? null : self.value;
  }

  var behave$b = does(implement(IDeref, {
    deref: deref$1
  }), implement(IForkable, {
    fork: fork$4
  }), implement(IOtherwise, {
    otherwise: otherwise$2
  }), implement(IFunctor, {
    fmap: fmap$4
  }));

  behave$b(Maybe);

  function isObject(self) {
    return self && self.constructor === Object;
  }
  function emptyObject() {
    return {};
  }

  var p = /*#__PURE__*/Object.freeze({
    __proto__: null,
    compare: compare$6,
    lt: lt,
    lte: lte,
    gt: gt,
    gte: gte,
    equiv: equiv$9,
    alike: alike,
    equivalent: equivalent,
    eq: eq,
    notEq: notEq,
    reduce: reduce$f,
    reducing: reducing,
    reducekv2: reducekv2,
    reducekv3: reducekv3,
    reducekv: reducekv$b,
    get: get,
    getIn: getIn,
    keys: keys$b,
    vals: vals$6,
    dissoc: dissoc$6,
    key: key,
    val: val,
    assoc: assoc$a,
    assocIn: assocIn,
    update: update,
    contains: contains$a,
    updateIn: updateIn,
    rewrite: rewrite,
    prop: prop,
    patch: patch,
    clone: clone$5,
    count: count$d,
    next: next$a,
    first: first$d,
    rest: rest$d,
    second: second$2,
    seq: seq$a,
    includes: includes$9,
    excludes: excludes,
    transpose: transpose,
    empty: empty$1,
    invoke: invoke,
    toArray: toArray$7,
    toObject: toObject$3,
    toPromise: toPromise,
    toDuration: toDuration$1
  });

  function descriptive$1(self) {
    return satisfies(ILookup, self) && satisfies(IMap, self) && !satisfies(IIndexed, self);
  }
  function subsumes(self, other) {
    return reducekv$b(function (memo, key, value) {
      return memo ? contains$a(self, key, value) : reduced(memo);
    }, true, other);
  }
  var emptied = branch(satisfies(IEmptyableCollection), empty$1, emptyObject);
  function juxtVals(self, value) {
    return reducekv$b(function (memo, key, f) {
      return assoc$a(memo, key, isFunction(f) ? f(value) : f);
    }, emptied(self), self);
  }
  function selectKeys(self, keys) {
    return reduce$f(function (memo, key) {
      return assoc$a(memo, key, get(self, key));
    }, emptied(self), keys);
  }
  function removeKeys(self, keys) {
    return reducekv$b(function (memo, key, value) {
      return includes$9(keys, key) ? memo : assoc$a(memo, key, value);
    }, emptied(self), self);
  }
  function mapKeys(self, f) {
    return reducekv$b(function (memo, key, value) {
      return assoc$a(memo, f(key), value);
    }, emptied(self), self);
  }

  function mapVals2(self, f) {
    return reducekv$b(function (memo, key, value) {
      return assoc$a(memo, key, f(value));
    }, self, self);
  }

  function mapVals3(init, f, pred) {
    return reduce$f(function (memo, key) {
      return pred(key) ? assoc$a(memo, key, f(get(memo, key))) : memo;
    }, init, keys$b(init));
  }

  var mapVals = overload(null, null, mapVals2, mapVals3);

  function defaults2(self, defaults) {
    return reducekv$b(assoc$a, defaults, self);
  }

  var defaults = overload(null, null, defaults2, reducing(defaults2));
  function compile(self) {
    return isFunction(self) ? self : function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return apply(invoke, self, args);
    };
  }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
  var keys$3 = Object.keys;
  var vals$1 = Object.values;

  function fill$1(self, params) {
    return reducekv$b(function (memo, key, value) {
      var _value, _params, _p$fill, _p, _params2, _fill;

      return assoc$a(memo, key, (_value = value, branch(isString, (_p = p, _p$fill = _p.fill, _params = params, function fill(_argPlaceholder) {
        return _p$fill.call(_p, _argPlaceholder, _params);
      }), isObject, (_fill = fill$1, _params2 = params, function fill(_argPlaceholder2) {
        return _fill(_argPlaceholder2, _params2);
      }), identity)(_value)));
    }, {}, self);
  }

  function merge$1() {
    for (var _len = arguments.length, maps = new Array(_len), _key = 0; _key < _len; _key++) {
      maps[_key] = arguments[_key];
    }

    return reduce$f(function (memo, map) {
      return reduce$f(function (memo, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        memo[key] = value;
        return memo;
      }, memo, seq$a(map));
    }, {}, maps);
  }

  function blank$1(self) {
    return keys$3(self).length === 0;
  }

  function compact1(self) {
    return compact2(self, function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);
          _ref4[0];
          var value = _ref4[1];

      return value == null;
    });
  }

  function compact2(self, pred) {
    return reducekv$b(function (memo, key, value) {
      return pred([key, value]) ? memo : assoc$a(memo, key, value);
    }, {}, self);
  }

  var compact = overload(null, compact1, compact2);

  function omit(self, entry) {
    var key$1 = key(entry);

    if (includes$4(self, entry)) {
      var result = clone$1(self);
      delete result[key$1];
      return result;
    } else {
      return self;
    }
  }

  function compare$2(self, other) {
    //assume like keys, otherwise use your own comparator!
    return equiv$9(self, other) ? 0 : descriptive$1(other) ? reduce$f(function (memo, key) {
      return memo == 0 ? compare$6(get(self, key), get(other, key)) : reduced$1(memo);
    }, 0, keys$b(self)) : -1;
  }

  function conj$1(self, entry) {
    var key$1 = key(entry),
        val$1 = val(entry);
    var result = clone$5(self);
    result[key$1] = val$1;
    return result;
  }

  function equiv$2(self, other) {
    return self === other ? true : descriptive$1(other) && count$d(keys$b(self)) === count$d(keys$b(other)) && reduce$f(function (memo, key) {
      return memo ? equiv$9(get(self, key), get(other, key)) : reduced$1(memo);
    }, true, keys$b(self));
  }

  function find$1(self, key) {
    return contains$1(self, key) ? [key, lookup$3(self, key)] : null;
  }

  function includes$4(self, entry) {
    var key$1 = key(entry),
        val$1 = val(entry);
    return self[key$1] === val$1;
  }

  function lookup$3(self, key) {
    return self[key];
  }

  function first$3(self) {
    var key = first$d(keys$3(self));
    return key ? [key, lookup$3(self, key)] : null;
  }

  function rest$3(self) {
    return next$3(self) || {};
  }

  function next2(self, keys) {
    if (seq$a(keys)) {
      return lazySeq(function () {
        var key = first$d(keys);
        return cons([key, lookup$3(self, key)], next2(self, next$a(keys)));
      });
    } else {
      return null;
    }
  }

  function next$3(self) {
    return next2(self, next$a(keys$3(self)));
  }

  function dissoc$1(self, key) {
    if (contains$a(self, key)) {
      var result = clone$1(self);
      delete result[key];
      return result;
    } else {
      return self;
    }
  }

  function assoc$1(self, key, value) {
    if (get(self, key) === value) {
      return self;
    } else {
      var result = clone$1(self);
      result[key] = value;
      return result;
    }
  }

  function contains$1(self, key) {
    return self.hasOwnProperty(key);
  }

  function seq$4(self) {
    if (!count$4(self)) return null;
    return map(function (key) {
      return [key, lookup$3(self, key)];
    }, keys$3(self));
  }

  function count$4(self) {
    return keys$3(self).length;
  }

  function clone$1(self) {
    return Object.assign({}, self);
  }

  function reduce$4(self, f, init) {
    return reduce$f(function (memo, key) {
      return f(memo, [key, lookup$3(self, key)]);
    }, init, keys$3(self));
  }

  function reducekv$2(self, f, init) {
    return reduce$f(function (memo, key) {
      return f(memo, key, lookup$3(self, key));
    }, init, keys$3(self));
  }

  function toArray$3(self) {
    return reduce$4(self, function (memo, pair) {
      memo.push(pair);
      return memo;
    }, []);
  }

  var behave$a = does(implement(ITemplate, {
    fill: fill$1
  }), implement(IBlankable, {
    blank: blank$1
  }), implement(IMergable, {
    merge: merge$1
  }), implement(ICompactible, {
    compact: compact
  }), implement(IEquiv, {
    equiv: equiv$2
  }), implement(ICoercible, {
    toArray: toArray$3,
    toObject: identity
  }), implement(IFind, {
    find: find$1
  }), implement(IOmissible, {
    omit: omit
  }), implement(IInclusive, {
    includes: includes$4
  }), implement(ICollection, {
    conj: conj$1
  }), implement(IClonable, {
    clone: clone$1
  }), implement(IComparable, {
    compare: compare$2
  }), implement(IReduce, {
    reduce: reduce$4
  }), implement(IKVReduce, {
    reducekv: reducekv$2
  }), implement(IMap, {
    dissoc: dissoc$1,
    keys: keys$3,
    vals: vals$1
  }), implement(IFn, {
    invoke: lookup$3
  }), implement(ISeq, {
    first: first$3,
    rest: rest$3
  }), implement(INext, {
    next: next$3
  }), implement(ILookup, {
    lookup: lookup$3
  }), implement(IEmptyableCollection, {
    empty: emptyObject
  }), implement(IAssociative, {
    assoc: assoc$1,
    contains: contains$1
  }), implement(ISeqable, {
    seq: seq$4
  }), implement(ICounted, {
    count: count$4
  }));

  Object.assign(behaviors, {
    Object: behave$a
  });
  behave$a(Object);

  function Okay(value) {
    this.value = value;
  }
  function okay(x) {
    return isError(x) ? x : new Okay(x);
  }
  function isOkay(x) {
    return x instanceof Okay;
  }

  function fmap$3(self, f) {
    try {
      return okay(f(self.value));
    } catch (ex) {
      return isError(ex) ? ex : new Error(ex);
    }
  }

  function fork$3(self, reject, resolve) {
    return resolve(self);
  }

  var behave$9 = does(implement(IForkable, {
    fork: fork$3
  }), implement(IFunctor, {
    fmap: fmap$3
  }));

  behave$9(Okay);

  function AssociativeSubset(obj, keys) {
    this.obj = obj;
    this.keys = keys;
  }
  function associativeSubset(obj, keys) {
    return seq$a(keys) ? new AssociativeSubset(obj, keys) : {};
  }
  function isAssociativeSubset(self) {
    return self.constructor === AssociativeSubset;
  }

  function toObject(self) {
    return into({}, self);
  }

  function find(self, key) {
    return includes$9(keys$b(self), key) ? [key, get(self.obj, key)] : null;
  }

  function lookup$2(self, key) {
    return includes$9(keys$b(self), key) ? self.obj[key] : null;
  }

  function dissoc(self, key) {
    return new self.constructor(self, remove$1(function (k) {
      return k === key;
    }, self.keys));
  }

  function keys$2(self) {
    return self.keys;
  }

  function vals(self) {
    var key = first$d(self.keys);
    return lazySeq(function () {
      return cons(lookup$2(self, key), vals(new self.constructor(self.obj, rest$d(self.keys))));
    });
  }

  function seq$3(self) {
    var key = first$d(self.keys);
    return lazySeq(function () {
      return cons([key, lookup$2(self, key)], new self.constructor(self.obj, rest$d(self.keys)));
    });
  }

  function count$3(self) {
    return count$d(self.keys);
  }

  function clone(self) {
    return toObject(self);
  }

  function reduce$3(self, f, init) {
    return reduce$f(function (memo, key) {
      return f(memo, [key, lookup$2(self, key)]);
    }, init, keys$2(self));
  }

  function reducekv$1(self, f, init) {
    return reduce$f(function (memo, key) {
      return f(memo, key, lookup$2(self, key));
    }, init, keys$2(self));
  }

  var behave$8 = does(iequiv, implement(ICoercible, {
    toObject: toObject
  }), implement(IFind, {
    find: find
  }), implement(IMap, {
    dissoc: dissoc,
    keys: keys$2,
    vals: vals
  }), implement(IReduce, {
    reduce: reduce$3
  }), implement(IKVReduce, {
    reducekv: reducekv$1
  }), implement(IClonable, {
    clone: clone
  }), implement(IEmptyableCollection, {
    empty: emptyObject
  }), implement(IFn, {
    invoke: lookup$2
  }), implement(ILookup, {
    lookup: lookup$2
  }), implement(ISeqable, {
    seq: seq$3
  }), implement(ICounted, {
    count: count$3
  }));

  behave$8(AssociativeSubset);

  function Recurrence(start, end, step, direction) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.direction = direction;
  }
  function emptyRecurrence() {
    return new Recurrence();
  }
  function recurrence1(obj) {
    return recurrence2(patch(obj, sod()), patch(obj, eod()));
  }

  function recurrence2(start, end) {
    return recurrence3(start, end, days(end == null || start <= end ? 1 : -1));
  }

  var recurrence3 = steps(Recurrence, isDate);

  function recurrence4(start, end, step, f) {
    var pred = end == null ? constantly(true) : directed(start, end) > 0 ? function (dt) {
      return compare$6(start, dt) <= 0;
    } : directed(start, end) < 0 ? function (dt) {
      return compare$6(start, dt) >= 0;
    } : constantly(true);
    return filter(pred, f(recurrence3(start, end, step)));
  }

  var recurrence = overload(emptyRecurrence, recurrence1, recurrence2, recurrence3, recurrence4);
  Recurrence.prototype[_Symbol.toStringTag] = "Recurrence";

  function split2(self, step) {
    var _step, _period;

    return map((_period = period, _step = step, function period(_argPlaceholder) {
      return _period(_argPlaceholder, _step);
    }), recurrence(start$2(self), end$2(self), step));
  }

  function split3$1(self, step, n) {
    return take(n, split2(self, step));
  }

  var split$1 = overload(null, null, split2, split3$1);

  function add(self, dur) {
    var _ref, _self, _dur, _p$add, _p;

    return end$2(self) ? new self.constructor(start$2(self), (_ref = (_self = self, end$2(_self)), (_p = p$3, _p$add = _p.add, _dur = dur, function add(_argPlaceholder2) {
      return _p$add.call(_p, _argPlaceholder2, _dur);
    })(_ref))) : self;
  }

  function merge(self, other) {
    return other == null ? self : new self.constructor(min(start$2(self), start$2(other)), max(end$2(other), end$2(other)));
  }

  function divide(self, step) {
    return divide$2(toDuration$1(self), step);
  }

  function start(self) {
    return self.start;
  }

  function end(self) {
    return self.end;
  }

  function includes$3(self, dt) {
    return dt != null && (self.start == null || compare$6(dt, self.start) >= 0) && (self.end == null || compare$6(dt, self.end) < 0);
  }

  function equiv$1(self, other) {
    return other != null && equiv$9(self.start, other.start) && equiv$9(self.end, other.end);
  }

  function toDuration(self) {
    return self.end == null || self.start == null ? duration(Number.POSITIVE_INFINITY) : duration(self.end - self.start);
  }

  function compare$1(self, other) {
    //TODO test with sort of periods
    return compare$6(other.start, self.start) || compare$6(other.end, self.end);
  }

  var behave$7 = does(emptyable, implement(ISplittable, {
    split: split$1
  }), implement(IAddable, {
    add: add
  }), implement(IMergable, {
    merge: merge
  }), implement(IDivisible, {
    divide: divide
  }), implement(IComparable, {
    compare: compare$1
  }), implement(ICoercible, {
    toDuration: toDuration
  }), implement(IInclusive, {
    includes: includes$3
  }), implement(IBounds, {
    start: start,
    end: end
  }), implement(IEquiv, {
    equiv: equiv$1
  }));

  behave$7(Period);

  function promise(handler) {
    return new Promise$1(handler);
  }
  function isPromise(self) {
    return self instanceof Promise$1;
  }

  function awaits(f) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (detect(isPromise, args)) {
        return fmap$b(Promise$1.all(args), function (args) {
          return f.apply(this, args);
        });
      } else {
        return f.apply(this, args);
      }
    };
  }
  function fromTask(task) {
    return new Promise$1(function (resolve, reject) {
      fork$6(task, reject, resolve);
    });
  }
  Promise$1.fromTask = fromTask;

  function fmap$2(self, resolve) {
    return self.then(resolve);
  }

  function fork$2(self, reject, resolve) {
    return self.then(resolve, reject);
  }

  function otherwise$1(self, other) {
    return fmap$2(self, function (value) {
      return value == null ? other : value;
    });
  }

  var behave$6 = does(implement(IOtherwise, {
    otherwise: otherwise$1
  }), implement(IForkable, {
    fork: fork$2
  }), implement(IFunctor, {
    fmap: fmap$2
  }));

  Object.assign(behaviors, {
    Promise: behave$6
  });
  behave$6(Promise$1);

  function seq$2(self) {
    return equiv$9(self.start, self.end) || self.step == null && self.direction == null && self.start == null && self.end == null ? null : self;
  }

  function first$2(self) {
    return self.end == null ? self.start : compare$6(self.start, self.end) * self.direction < 0 ? self.start : null;
  }

  function rest$2(self) {
    return next$a(self) || new self.constructor(self.end, self.end, self.step, self.direction);
  }

  function next$2(self) {
    if (!seq$2(self)) return null;
    var stepped = add$3(self.start, self.step);
    return self.end == null || compare$6(stepped, self.end) * self.direction < 0 ? new self.constructor(stepped, self.end, self.step, self.direction) : null;
  }

  function equiv(self, other) {
    return kin(self, other) ? alike(self, other) : equiv$8(self, other);
  }

  function reduce$2(self, f, init) {
    var memo = init,
        coll = seq$2(self);

    while (!isReduced(memo) && coll) {
      memo = f(memo, first$d(coll));
      coll = next$a(coll);
    }

    return unreduced(memo);
  }

  function reducekv(self, f, init) {
    var memo = init,
        coll = seq$2(self),
        n = 0;

    while (!isReduced(memo) && coll) {
      memo = f(memo, n++, first$d(coll));
      coll = next$a(coll);
    }

    return unreduced(memo);
  }

  function toArray$2(self) {
    return reduce$2(self, function (memo, date) {
      memo.push(date);
      return memo;
    }, []);
  }

  function inverse(self) {
    var start = self.end,
        end = self.start,
        step = inverse$1(self.step);
    return new self.constructor(start, end, step, directed(start, step));
  }

  function nth(self, idx) {
    return first$d(drop(idx, self));
  }

  function count$2(self) {
    var n = 0,
        xs = self;

    while (seq$a(xs)) {
      n++;
      xs = rest$d(xs);
    }

    return n;
  }

  function includes$2(self, value) {
    var xs = self;

    if (self.direction > 0) {
      while (seq$a(xs)) {
        var c = compare$6(first$d(xs), value);
        if (c === 0) return true;
        if (c > 0) break;
        xs = rest$d(xs);
      }
    } else {
      while (seq$a(xs)) {
        var _c = compare$6(first$d(xs), value);

        if (_c === 0) return true;
        if (_c < 0) break;
        xs = rest$d(xs);
      }
    }

    return false;
  }

  var behave$5 = does(iterable, emptyable, implement(ISequential$1), implement(IInverse, {
    inverse: inverse
  }), implement(IIndexed, {
    nth: nth
  }), implement(ICounted, {
    count: count$2
  }), implement(IInclusive, {
    includes: includes$2
  }), implement(ISeqable, {
    seq: seq$2
  }), implement(ICoercible, {
    toArray: toArray$2
  }), implement(IReduce, {
    reduce: reduce$2
  }), implement(IKVReduce, {
    reducekv: reducekv
  }), implement(INext, {
    next: next$2
  }), implement(ISeq, {
    first: first$2,
    rest: rest$2
  }), implement(IEquiv, {
    equiv: equiv
  }));

  behave$5(Range);

  var record = behave$u;

  behave$5(Recurrence);

  var test = unbind(RegExp.prototype.test);
  function reFind(re, s) {
    if (!isString(s)) {
      throw new TypeError("reFind must match against string.");
    }

    var matches = re.exec(s);

    if (matches) {
      return count$d(matches) === 1 ? first$d(matches) : matches;
    }
  }

  function reFindAll2(text, find) {
    var found = find(text);
    return found ? lazySeq(function () {
      return cons(found, reFindAll2(text, find));
    }) : emptyList();
  }

  function reFindAll(re, text) {
    var _re, _reFind;

    return reFindAll2(text, (_reFind = reFind, _re = re, function reFind(_argPlaceholder) {
      return _reFind(_re, _argPlaceholder);
    }));
  }
  function reMatches(re, s) {
    if (!isString(s)) {
      throw new TypeError("reMatches must match against string.");
    }

    var matches = re.exec(s);

    if (first$d(matches) === s) {
      return count$d(matches) === 1 ? first$d(matches) : matches;
    }
  }
  function reSeq(re, s) {
    return lazySeq(function () {
      var matchData = reFind(re, s),
          matchIdx = s.search(re),
          matchStr = matchData instanceof Array ? first$d(matchData) : matchData,
          postIdx = matchIdx + max(1, count$d(matchStr)),
          postMatch = s.substring(postIdx);
      return matchData ? cons(matchData, reSeq(new RegExp(re.source, re.flags), postMatch)) : emptyList();
    });
  }
  function rePattern(s) {
    if (isRegExp(s)) return s;
    if (!isString(s)) throw new TypeError("rePattern is derived from a string.");
    var found = reFind(/^\(\?([idmsux]*)\)/, s),
        prefix = get(found, 0),
        flags = get(found, 1),
        pattern = s.substring(count$d(prefix));
    return new RegExp(pattern, flags || "");
  }

  function Right(value) {
    this.value = value;
  }

  function right1(value) {
    return new Right(value);
  }

  var right = overload(null, right1, partial(thrush, right1));
  function isRight(self) {
    return self instanceof Right;
  }
  var just = right;

  function fmap$1(self, f) {
    return right(f(self.value));
  }

  function otherwise(self, other) {
    return self.value;
  }

  function fork$1(self, reject, resolve) {
    return resolve(self.value);
  }

  function deref(self) {
    return self.value;
  }

  var behave$4 = does(implement(IDeref, {
    deref: deref
  }), implement(IForkable, {
    fork: fork$1
  }), implement(IOtherwise, {
    otherwise: otherwise
  }), implement(IFunctor, {
    fmap: fmap$1
  }));

  behave$4(Right);

  function seq$1(self) {
    return seq$a(self.items);
  }

  function toArray$1(self) {
    return toArray$7(self.items);
  }

  function first$1(self) {
    return first$d(self.items);
  }

  function rest$1(self) {
    return next$1(self) || empty(self);
  }

  function next$1(self) {
    var items = next$a(self.items);
    return items ? Object.assign(clone$5(self), {
      items: items
    }) : null;
  }

  function append(self, other) {
    return Object.assign(clone$5(self), {
      items: append$1(self.items, other)
    });
  }

  function prepend$1(self, other) {
    return Object.assign(clone$5(self), {
      items: prepend$2(self.items, other)
    });
  }

  function includes$1(self, name) {
    return includes$9(self.items, name);
  }

  function count$1(self) {
    return count$d(self.items);
  }

  function empty(self) {
    return clone$5(self, {
      items: []
    });
  }

  function reduce$1(self, f, init) {
    return reduce$f(f, init, self.items);
  }

  var iseries = does(iterable, implement(ISequential$1), implement(ICounted, {
    count: count$1
  }), implement(IInclusive, {
    includes: includes$1
  }), implement(IAppendable, {
    append: append
  }), implement(IPrependable, {
    prepend: prepend$1
  }), implement(IEmptyableCollection, {
    empty: empty
  }), implement(ICoercible, {
    toArray: toArray$1
  }), implement(ISeqable, {
    seq: seq$1
  }), implement(INext, {
    next: next$1
  }), implement(IReduce, {
    reduce: reduce$1
  }), implement(ISeq, {
    first: first$1,
    rest: rest$1
  }));

  function split1(str) {
    return str.split("");
  }

  function split3(str, pattern, n) {
    var parts = [];

    while (str && n !== 0) {
      var found = str.match(pattern);

      if (!found || n < 2) {
        parts.push(str);
        break;
      }

      var pos = str.indexOf(found),
          part = str.substring(0, pos);
      parts.push(part);
      str = str.substring(pos + found.length);
      n = n ? n - 1 : n;
    }

    return parts;
  }

  var split = overload(null, split1, unbind(String.prototype.split), split3);

  function fill(self, params) {
    return reducekv$b(function (text, key, value) {
      return replace(text, new RegExp("\\{" + key + "\\}", 'ig'), value);
    }, self, params);
  }

  function blank(self) {
    return self.trim().length === 0;
  }

  function compare(self, other) {
    return self === other ? 0 : self > other ? 1 : -1;
  }

  function conj(self, other) {
    return self + other;
  }

  function seq2(self, idx) {
    return idx < self.length ? lazySeq(function () {
      return cons(self[idx], seq2(self, idx + 1));
    }) : null;
  }

  function seq(self) {
    return seq2(self, 0);
  }

  function lookup$1(self, key) {
    return self[key];
  }

  function first(self) {
    return self[0] || null;
  }

  function rest(self) {
    return next(self) || "";
  }

  function next(self) {
    return self.substring(1) || null;
  }

  function prepend(self, head) {
    return head + self;
  }

  function includes(self, str) {
    return self.indexOf(str) > -1;
  }

  function toArray(self) {
    return self.split("");
  }

  function reduce(self, f, init) {
    var memo = init;
    var coll = seq$a(self);

    while (coll && !isReduced(memo)) {
      memo = f(memo, first$d(coll));
      coll = next$a(coll);
    }

    return unreduced(memo);
  }

  function matches(self, re) {
    return rePattern(re).test(self);
  }

  var behave$3 = does(iindexed, implement(ISplittable, {
    split: split
  }), implement(IBlankable, {
    blank: blank
  }), implement(ITemplate, {
    fill: fill
  }), implement(IMatchable, {
    matches: matches
  }), implement(ICollection, {
    conj: conj
  }), implement(IReduce, {
    reduce: reduce
  }), implement(ICoercible, {
    toArray: toArray
  }), implement(IComparable, {
    compare: compare
  }), implement(IInclusive, {
    includes: includes
  }), implement(IAppendable, {
    append: conj
  }), implement(IPrependable, {
    prepend: prepend
  }), implement(IEmptyableCollection, {
    empty: emptyString
  }), implement(IFn, {
    invoke: lookup$1
  }), implement(ILookup, {
    lookup: lookup$1
  }), implement(ISeqable, {
    seq: seq
  }), implement(ISeq, {
    first: first,
    rest: rest
  }), implement(INext, {
    next: next
  }));

  Object.assign(behaviors, {
    String: behave$3
  });
  behave$3(String);

  function Task(fork) {
    this.fork = fork;
  }
  function task(fork) {
    return new Task(fork);
  }

  function resolve(value) {
    return task(function (reject, resolve) {
      resolve(value);
    });
  }

  function reject(value) {
    return task(function (reject, resolve) {
      reject(value);
    });
  }

  Task.of = resolve;
  Task.resolve = resolve;
  Task.reject = reject;

  function fmap(self, f) {
    return task(function (reject, resolve) {
      self.fork(reject, comp(resolve, f));
    });
  }

  function chain(self, f) {
    return task(function (reject, resolve) {
      self.fork(reject, function (value) {
        fork$6(f(value), reject, resolve);
      });
    });
  }

  function fork(self, reject, resolve) {
    self.fork(reject, resolve);
  }

  var behave$2 = does(implement(IChainable, {
    chain: chain
  }), implement(IForkable, {
    fork: fork
  }), implement(IFunctor, {
    fmap: fmap
  }));

  behave$2(Task);

  function UID(id) {
    this.id = id;
  }

  UID.prototype.toString = function () {
    return this.id;
  };

  function uid0() {
    var head = Math.random() * 46656 | 0,
        tail = Math.random() * 46656 | 0;
    return uid1(("000" + head.toString(36)).slice(-3) + ("000" + tail.toString(36)).slice(-3));
  }

  function uid1(id) {
    return new UID(id);
  }

  var uid = overload(uid0, uid1);

  behave$h(UID);

  function isWeakMap(self) {
    return self && self.constructor === WeakMap;
  }

  function weakMap1(obj) {
    return new WeakMap(obj);
  }

  function weakMap0() {
    return new WeakMap();
  }

  var weakMap = overload(weakMap0, weakMap1);

  function assoc(self, key, value) {
    return self.set(key, value);
  }

  function contains(self, key) {
    return self.has(key);
  }

  function lookup(self, key) {
    return self.get(key);
  }

  function count(self) {
    return self.size;
  }

  var behave$1 = does(implement(IClonable, {
    clone: identity
  }), implement(ICounted, {
    count: count
  }), implement(ILookup, {
    lookup: lookup
  }), implement(IAssociative, {
    assoc: assoc,
    contains: contains
  }));

  Object.assign(behaviors, {
    WeakMap: behave$1
  });
  behave$1(WeakMap);

  function keys$1(self) {
    return self.keys();
  }

  var iprotocol = does(implement(IMap, {
    keys: keys$1
  }));

  var _behaviors, _behaves, _param, _test, _days, _recurs, _ISeq, _satisfies;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var serieslike = iseries;
  iprotocol(Protocol);
  var behave = (_behaves = behaves, _behaviors = behaviors, function behaves(_argPlaceholder) {
    return _behaves(_behaviors, _argPlaceholder);
  });
  var yank = called(omit$3, "`yank` is deprecated — use `omit` instead.");
  var numeric = (_test = test, _param = /^\d+$/i, function test(_argPlaceholder2) {
    return _test(_param, _argPlaceholder2);
  });

  function siblings(self) {
    var parent = parent$1(self);

    if (parent) {
      return filter(function (sibling) {
        return sibling !== self;
      }, children$1(parent));
    } else {
      return emptyList();
    }
  }

  function prevSiblings(self) {
    return reverse(takeWhile(function (sibling) {
      return sibling !== self;
    }, siblings(self)));
  }

  function nextSiblings(self) {
    return rest$d(dropWhile(function (sibling) {
      return sibling !== self;
    }, siblings(self)));
  }

  var prevSibling = comp(first$d, prevSiblings$2);
  var nextSibling = comp(first$d, nextSiblings$2);
  var parents = upward(parent$1);
  var root = comp(last, parents);

  function closest(self, pred) {
    return detect(pred, cons(self, parents$2(self)));
  }

  extend(IHierarchy, {
    siblings: siblings,
    prevSibling: prevSibling,
    nextSibling: nextSibling,
    prevSiblings: prevSiblings,
    nextSiblings: nextSiblings,
    parents: parents,
    closest: closest,
    root: root
  });

  function forward1(key) {
    return function forward(f) {
      return function (self) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return f.apply(this, [self[key]].concat(args));
      };
    };
  }

  function forwardN(target) {
    var fwd = forward1(target);

    for (var _len2 = arguments.length, protocols = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      protocols[_key2 - 1] = arguments[_key2];
    }

    var behavior = mapa(function (protocol) {
      return implement(protocol, reduce$f(function (memo, key) {
        return assoc$a(memo, key, fwd(protocol[key]));
      }, {}, keys$b(protocol)));
    }, protocols);
    return does.apply(void 0, _toConsumableArray(behavior));
  }

  var forward = overload(null, forward1, forwardN);
  var forwardTo = called(forward, "`forwardTo` is deprecated — use `forward` instead.");

  function recurs2(pd, step) {
    return recurrence(start$2(pd), end$2(pd), step);
  }

  var recurs = overload(null, (_recurs = recurs2, _days = days(1), function recurs2(_argPlaceholder3) {
    return _recurs(_argPlaceholder3, _days);
  }), recurs2);
  function inclusive(self) {
    return new self.constructor(self.start, add$3(self.end, self.step), self.step, self.direction);
  }

  function cleanlyN(f) {
    try {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return f.apply(void 0, args);
    } catch (_unused) {
      return null;
    }
  }

  var cleanly = overload(null, curry(cleanlyN, 2), cleanlyN);

  function mod3(obj, key, f) {
    if (key in obj) {
      obj[key] = f(obj[key]); //must be a mutable copy
    }

    return obj;
  }

  function modN(obj, key, value) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
      args[_key4 - 3] = arguments[_key4];
    }

    return args.length > 0 ? modN.apply(void 0, [mod3(obj, key, value)].concat(args)) : mod3(obj, key, value);
  }

  function edit(obj) {
    var copy = clone$5(obj);

    for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }

    args.unshift(copy);
    return modN.apply(copy, args);
  }
  function deconstruct(dur) {
    var memo = dur;

    for (var _len6 = arguments.length, units = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      units[_key6 - 1] = arguments[_key6];
    }

    return mapa(function (unit) {
      var n = fmap$b(divide$2(memo, unit), Math.floor);
      memo = subtract(memo, fmap$b(unit, constantly(n)));
      return n;
    }, units);
  }
  function toQueryString(obj) {
    var _str, _mapkv, _str2, _join, _collapse;

    return just(obj, (_mapkv = mapkv, _str = (_str2 = str, function str(_argPlaceholder5, _argPlaceholder6) {
      return _str2(_argPlaceholder5, "=", _argPlaceholder6);
    }), function mapkv(_argPlaceholder4) {
      return _mapkv(_str, _argPlaceholder4);
    }), (_join = join, function join(_argPlaceholder7) {
      return _join("&", _argPlaceholder7);
    }), (_collapse = collapse, function collapse(_argPlaceholder8) {
      return _collapse("?", _argPlaceholder8);
    }));
  }
  function fromQueryString(url) {
    var params = {};
    each(function (match) {
      var key = decodeURIComponent(match[1]),
          val = decodeURIComponent(match[2]);
      params[key] = val;
    }, reFindAll(/[?&]([^=&]*)=([^=&]*)/g, url));
    return params;
  }
  function unique(xs) {
    return toArray$7(new Set$1(toArray$7(xs)));
  }
  var second = branch((_satisfies = satisfies, _ISeq = ISeq, function satisfies(_argPlaceholder9) {
    return _satisfies(_ISeq, _argPlaceholder9);
  }), second$2, second$1);
  function expands(f) {
    function expand() {
      for (var _len7 = arguments.length, contents = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        contents[_key7] = arguments[_key7];
      }

      return detect(isFunction, contents) ? postpone.apply(void 0, contents) : f.apply(void 0, contents);
    }

    function postpone() {
      for (var _len8 = arguments.length, contents = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        contents[_key8] = arguments[_key8];
      }

      return function (value) {
        var expanded = map(function (content) {
          return isFunction(content) ? content(value) : content;
        }, contents);
        return apply(expand, expanded);
      };
    }

    return expand;
  }
  function xarg(fn, n, f) {
    return function () {
      arguments[n] = f(arguments[n]);
      return fn.apply(this, arguments);
    };
  }
  function xargs(f) {
    for (var _len9 = arguments.length, fs = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
      fs[_key9 - 1] = arguments[_key9];
    }

    return function () {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      return apply(f, map(execute, fs, args));
    };
  }

  function filled2(f, g) {
    return function () {
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      return seq$a(filter(isNil, args)) ? g.apply(void 0, args) : f.apply(void 0, args);
    };
  }

  function filled1(f) {
    return filled2(f, noop);
  }

  var filled = overload(null, filled1, filled2);
  function elapsed(self) {
    return duration(end$2(self) - start$2(self));
  }
  function collapse() {
    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    return some$1(isBlank, args) ? "" : join("", args);
  }

  function isNotConstructor(f) {
    return isFunction(f) && !/^[A-Z]./.test(name$1(f));
  } //convenience for wrapping batches of functions.


  function impart(self, f) {
    //set retraction to identity to curb retraction overhead
    return reducekv$b(function (memo, key, value) {
      return assoc$a(memo, key, isNotConstructor(value) ? f(value) : value);
    }, {}, self);
  }

  function include2(self, value) {
    var _value, _p$conj, _p, _value2, _p$omit, _p2, _value3, _p$includes, _p3;

    return toggles((_p = p$2, _p$conj = _p.conj, _value = value, function conj(_argPlaceholder10) {
      return _p$conj.call(_p, _argPlaceholder10, _value);
    }), (_p2 = p$2, _p$omit = _p2.omit, _value2 = value, function omit(_argPlaceholder11) {
      return _p$omit.call(_p2, _argPlaceholder11, _value2);
    }), (_p3 = p$2, _p$includes = _p3.includes, _value3 = value, function includes(_argPlaceholder12) {
      return _p$includes.call(_p3, _argPlaceholder12, _value3);
    }), self);
  }

  function include3(self, value, want) {
    var _value4, _p$conj2, _p4, _value5, _p$omit2, _p5, _value6, _p$includes2, _p6;

    return toggles((_p4 = p$2, _p$conj2 = _p4.conj, _value4 = value, function conj(_argPlaceholder13) {
      return _p$conj2.call(_p4, _argPlaceholder13, _value4);
    }), (_p5 = p$2, _p$omit2 = _p5.omit, _value5 = value, function omit(_argPlaceholder14) {
      return _p$omit2.call(_p5, _argPlaceholder14, _value5);
    }), (_p6 = p$2, _p$includes2 = _p6.includes, _value6 = value, function includes(_argPlaceholder15) {
      return _p$includes2.call(_p6, _argPlaceholder15, _value6);
    }), self, want);
  }

  var include = overload(null, null, include2, include3);
  var fmt = expands(str);
  function coalesce() {
    for (var _len13 = arguments.length, fs = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      fs[_key13] = arguments[_key13];
    }

    return function () {
      return detect(isSome, map(applying.apply(void 0, arguments), fs));
    };
  }
  function when(pred) {
    for (var _len14 = arguments.length, xs = new Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
      xs[_key14 - 1] = arguments[_key14];
    }

    return last(map(realize, pred ? xs : null));
  }
  function readable(keys) {
    var lookup = keys ? function (self, key) {
      if (!includes$9(keys, key)) {
        throw new Error("Cannot read from " + key);
      }

      return self[key];
    } : function (self, key) {
      return self[key];
    };
    return implement(ILookup, {
      lookup: lookup
    });
  }
  function writable(keys) {
    function clone(self) {
      return Object.assign(Object.create(self.constructor.prototype), self);
    }

    function contains(self, key) {
      return self.hasOwnProperty(key);
    }

    var assoc = keys ? function (self, key, value) {
      if (!includes$9(keys, key) || !contains(self, key)) {
        throw new Error("Cannot write to " + key);
      }

      var tgt = clone(self);
      tgt[key] = value;
      return tgt;
    } : function (self, key, value) {
      if (!contains(self, key)) {
        throw new Error("Cannot write to " + key);
      }

      var tgt = clone(self);
      tgt[key] = value;
      return tgt;
    };
    return does(implement(IClonable, {
      clone: clone
    }), implement(IAssociative, {
      assoc: assoc,
      contains: contains
    }));
  }

  function scanKey1(better) {
    return partial(scanKey, better);
  }

  function scanKey3(better, k, x) {
    return x;
  }

  function scanKey4(better, k, x, y) {
    return better(k(x), k(y)) ? x : y;
  }

  function scanKeyN(better, k, x) {
    for (var _len15 = arguments.length, args = new Array(_len15 > 3 ? _len15 - 3 : 0), _key15 = 3; _key15 < _len15; _key15++) {
      args[_key15 - 3] = arguments[_key15];
    }

    return apply(reduce$f, partial(scanKey3, better), x, args);
  }

  var scanKey = overload(null, scanKey1, null, scanKey3, scanKey4, scanKeyN);
  var maxKey = scanKey(gt);
  var minKey = scanKey(lt);

  function absorb2(tgt, src) {
    return reducekv$b(function (memo, key, value) {
      var was = get(memo, key);
      var absorbed;

      if (was == null) {
        absorbed = value;
      } else if (descriptive(value)) {
        absorbed = into(empty$1(was), absorb(was, value));
      } else if (satisfies(ISequential, value)) {
        absorbed = into(empty$1(was), concat(was, value));
      } else {
        absorbed = value;
      }

      return assoc$a(memo, key, absorbed);
    }, tgt, src || empty$1(tgt));
  }

  var absorb = overload(constantly({}), identity, absorb2, reducing(absorb2));

  exports.AssociativeSubset = AssociativeSubset;
  exports.Benchmark = Benchmark;
  exports.Concatenated = Concatenated;
  exports.Duration = Duration;
  exports.EmptyList = EmptyList;
  exports.FiniteStateMachine = FiniteStateMachine;
  exports.Fluent = Fluent;
  exports.GUID = GUID;
  exports.IAddable = IAddable;
  exports.IAppendable = IAppendable;
  exports.IAssociative = IAssociative;
  exports.IBlankable = IBlankable;
  exports.IBounds = IBounds;
  exports.IChainable = IChainable;
  exports.IClonable = IClonable;
  exports.ICoercible = ICoercible;
  exports.ICollection = ICollection;
  exports.ICompactible = ICompactible;
  exports.IComparable = IComparable;
  exports.ICounted = ICounted;
  exports.IDeref = IDeref;
  exports.IDisposable = IDisposable;
  exports.IDivisible = IDivisible;
  exports.IEmptyableCollection = IEmptyableCollection;
  exports.IEquiv = IEquiv;
  exports.IFind = IFind;
  exports.IFn = IFn;
  exports.IForkable = IForkable;
  exports.IFunctor = IFunctor;
  exports.IHandler = IHandler;
  exports.IHierarchy = IHierarchy;
  exports.IIdentifiable = IIdentifiable;
  exports.IInclusive = IInclusive;
  exports.IIndexed = IIndexed;
  exports.IInsertable = IInsertable;
  exports.IInverse = IInverse;
  exports.IKVReduce = IKVReduce;
  exports.ILookup = ILookup;
  exports.IMap = IMap;
  exports.IMapEntry = IMapEntry;
  exports.IMatchable = IMatchable;
  exports.IMergable = IMergable;
  exports.IMultipliable = IMultipliable;
  exports.INamable = INamable;
  exports.INext = INext;
  exports.IOmissible = IOmissible;
  exports.IOtherwise = IOtherwise;
  exports.IPath = IPath;
  exports.IPrependable = IPrependable;
  exports.IReduce = IReduce;
  exports.IReset = IReset;
  exports.IReversible = IReversible;
  exports.IRevertible = IRevertible;
  exports.ISend = ISend;
  exports.ISeq = ISeq;
  exports.ISeqable = ISeqable;
  exports.ISequential = ISequential$1;
  exports.ISet = ISet;
  exports.ISplittable = ISplittable;
  exports.IStateMachine = IStateMachine;
  exports.ISwap = ISwap;
  exports.ITemplate = ITemplate;
  exports.Indexed = Indexed;
  exports.IndexedSeq = IndexedSeq;
  exports.Journal = Journal;
  exports.LazySeq = LazySeq;
  exports.Left = Left;
  exports.Lens = Lens;
  exports.List = List;
  exports.Maybe = Maybe;
  exports.Multimap = Multimap;
  exports.Nil = Nil;
  exports.Okay = Okay;
  exports.Period = Period;
  exports.Protocol = Protocol;
  exports.ProtocolLookupError = ProtocolLookupError;
  exports.Range = Range;
  exports.Recurrence = Recurrence;
  exports.Reduced = Reduced;
  exports.RevSeq = RevSeq;
  exports.Right = Right;
  exports.Task = Task;
  exports.UID = UID;
  exports.absorb = absorb;
  exports.add = add$3;
  exports.after = after;
  exports.ako = ako;
  exports.alike = alike;
  exports.all = all;
  exports.also = also;
  exports.ancestors = ancestors;
  exports.and = and;
  exports.annually = annually;
  exports.any = any;
  exports.append = append$1;
  exports.apply = apply;
  exports.applying = applying;
  exports.arity = arity;
  exports.array = array;
  exports.asLeaves = asLeaves;
  exports.asc = asc;
  exports.assoc = assoc$a;
  exports.assocIn = assocIn;
  exports.associativeSubset = associativeSubset;
  exports.assume = assume;
  exports.attach = attach;
  exports.average = average$1;
  exports.awaits = awaits;
  exports.before = before;
  exports.behave = behave;
  exports.behaves = behaves;
  exports.behaviors = behaviors;
  exports.benchmark = benchmark;
  exports.best = best;
  exports.between = between;
  exports.binary = binary;
  exports.blank = blank$2;
  exports.blot = blot;
  exports.bool = bool;
  exports.boolean = _boolean;
  exports.both = both;
  exports.braid = braid;
  exports.branch = branch;
  exports.butlast = butlast;
  exports.called = called;
  exports.camelToDashed = camelToDashed;
  exports.chain = chain$1;
  exports.children = children$1;
  exports.clamp = clamp;
  exports.cleanly = cleanly;
  exports.clockHour = clockHour;
  exports.clone = clone$5;
  exports.closest = closest$2;
  exports.coalesce = coalesce;
  exports.collapse = collapse;
  exports.comp = comp;
  exports.compact = compact$1;
  exports.compare = compare$6;
  exports.compile = compile;
  exports.complement = complement;
  exports.concat = concat;
  exports.concatenated = concatenated;
  exports.cond = cond;
  exports.conj = conj$8;
  exports.cons = cons;
  exports.constantly = constantly;
  exports.construct = construct;
  exports.constructs = constructs;
  exports.contains = contains$a;
  exports.count = count$d;
  exports.countBy = countBy;
  exports.curry = curry;
  exports.cycle = cycle;
  exports.date = date;
  exports.day = day;
  exports.days = days;
  exports.debug = debug;
  exports.dec = dec;
  exports.deconstruct = deconstruct;
  exports.dedupe = dedupe;
  exports.defaults = defaults;
  exports.deferring = deferring;
  exports.deref = deref$8;
  exports.desc = desc;
  exports.descendants = descendants$1;
  exports.descriptive = descriptive$1;
  exports.detach = detach;
  exports.detect = detect;
  exports.difference = difference;
  exports.directed = directed;
  exports.disj = disj;
  exports.dispose = dispose;
  exports.dissoc = dissoc$6;
  exports.divide = divide$2;
  exports.doall = doall;
  exports.does = does;
  exports.doing = doing;
  exports.dorun = dorun;
  exports.doseq = doseq;
  exports.dotimes = dotimes;
  exports.doto = doto;
  exports.dow = dow;
  exports.downward = downward;
  exports.drop = drop;
  exports.dropLast = dropLast;
  exports.dropWhile = dropWhile;
  exports.duration = duration;
  exports.each = each;
  exports.eachIndexed = eachIndexed;
  exports.eachkv = eachkv;
  exports.eachvk = eachvk;
  exports.edit = edit;
  exports.either = either;
  exports.elapsed = elapsed;
  exports.empty = empty$1;
  exports.emptyArray = emptyArray;
  exports.emptyList = emptyList;
  exports.emptyObject = emptyObject;
  exports.emptyPeriod = emptyPeriod;
  exports.emptyRange = emptyRange;
  exports.emptyRecurrence = emptyRecurrence;
  exports.emptyString = emptyString;
  exports.end = end$2;
  exports.endsWith = endsWith;
  exports.entries = entries;
  exports.eod = eod;
  exports.eom = eom;
  exports.eoy = eoy;
  exports.eq = eq;
  exports.equiv = equiv$9;
  exports.equivalent = equivalent;
  exports.error = error;
  exports.every = every;
  exports.everyPair = everyPair;
  exports.everyPred = everyPred;
  exports.excludes = excludes;
  exports.execute = execute;
  exports.expands = expands;
  exports.extend = extend;
  exports.factory = factory;
  exports.fill = fill$2;
  exports.filled = filled;
  exports.filter = filter;
  exports.filtera = filtera;
  exports.find = find$2;
  exports.first = first$d;
  exports.flatten = flatten;
  exports.flip = flip;
  exports.float = _float;
  exports.fluent = fluent;
  exports.flush = flush$1;
  exports.fmap = fmap$b;
  exports.fmt = fmt;
  exports.fnil = fnil;
  exports.fold = fold;
  exports.folding = folding;
  exports.foldkv = foldkv;
  exports.fork = fork$6;
  exports.forward = forward;
  exports.forwardTo = forwardTo;
  exports.fromQueryString = fromQueryString;
  exports.fromTask = fromTask;
  exports.fsm = fsm;
  exports.generate = generate;
  exports.get = get;
  exports.getIn = getIn;
  exports.groupBy = groupBy;
  exports.gt = gt;
  exports.gte = gte;
  exports.guard = guard;
  exports.guid = guid;
  exports.handle = handle;
  exports.handles = handles;
  exports.hour = hour;
  exports.hours = hours;
  exports.iarray = iarray;
  exports.identifier = identifier;
  exports.identity = identity;
  exports.idx = idx$3;
  exports.impart = impart;
  exports.implement = implement;
  exports.implement0 = implement0;
  exports.inc = inc;
  exports.include = include;
  exports.includes = includes$9;
  exports.inclusive = inclusive;
  exports.index = index;
  exports.indexOf = indexOf;
  exports.indexed = indexed;
  exports.indexedSeq = indexedSeq;
  exports.info = info;
  exports.initial = initial;
  exports.inside = inside;
  exports.int = _int;
  exports.integers = integers;
  exports.interleave = interleave;
  exports.interleaved = interleaved;
  exports.interpose = interpose;
  exports.intersection = intersection;
  exports.into = into;
  exports.inverse = inverse$1;
  exports.invoke = invoke;
  exports.invokes = invokes;
  exports.is = is;
  exports.isArray = isArray;
  exports.isAssociativeSubset = isAssociativeSubset;
  exports.isBlank = isBlank;
  exports.isBoolean = isBoolean;
  exports.isConcatenated = isConcatenated;
  exports.isDate = isDate;
  exports.isDistinct = isDistinct;
  exports.isEmpty = isEmpty;
  exports.isError = isError;
  exports.isEven = isEven;
  exports.isFalse = isFalse;
  exports.isFloat = isFloat;
  exports.isFunction = isFunction;
  exports.isGUID = isGUID;
  exports.isIdentical = isIdentical;
  exports.isInstance = isInstance;
  exports.isInt = isInt;
  exports.isInteger = isInteger;
  exports.isLeft = isLeft;
  exports.isList = isList;
  exports.isMaybe = isMaybe;
  exports.isNaN = isNaN$1;
  exports.isNative = isNative;
  exports.isNeg = isNeg;
  exports.isNil = isNil;
  exports.isNumber = isNumber;
  exports.isObject = isObject;
  exports.isOdd = isOdd;
  exports.isOkay = isOkay;
  exports.isPos = isPos;
  exports.isPromise = isPromise;
  exports.isReduced = isReduced;
  exports.isRegExp = isRegExp;
  exports.isRight = isRight;
  exports.isSome = isSome;
  exports.isString = isString;
  exports.isSymbol = isSymbol;
  exports.isTrue = isTrue;
  exports.isWeakMap = isWeakMap;
  exports.isZero = isZero;
  exports.iterable = iterable;
  exports.iterate = iterate$1;
  exports.join = join;
  exports.journal = journal;
  exports.just = just;
  exports.juxt = juxt;
  exports.juxtVals = juxtVals;
  exports.keep = keep;
  exports.keepIndexed = keepIndexed;
  exports.key = key;
  exports.keyed = keyed;
  exports.keys = keys$b;
  exports.kin = kin;
  exports.last = last;
  exports.lazyIterable = lazyIterable;
  exports.lazySeq = lazySeq;
  exports.least = least;
  exports.leaves = leaves;
  exports.left = left;
  exports.left1 = left1;
  exports.lens = lens;
  exports.list = list;
  exports.log = log;
  exports.lowerCase = lowerCase;
  exports.lpad = lpad;
  exports.lt = lt;
  exports.lte = lte;
  exports.ltrim = ltrim;
  exports.map = map;
  exports.mapArgs = mapArgs;
  exports.mapIndexed = mapIndexed;
  exports.mapKeys = mapKeys;
  exports.mapSome = mapSome;
  exports.mapVals = mapVals;
  exports.mapa = mapa;
  exports.mapcat = mapcat;
  exports.mapkv = mapkv;
  exports.mapvk = mapvk;
  exports.matches = matches$1;
  exports.max = max;
  exports.maxKey = maxKey;
  exports.maybe = maybe;
  exports.mdow = mdow;
  exports.measure = measure;
  exports.memoize = memoize;
  exports.merge = merge$4;
  exports.mergeWith = mergeWith;
  exports.midnight = midnight;
  exports.millisecond = millisecond;
  exports.milliseconds = milliseconds;
  exports.min = min;
  exports.minKey = minKey;
  exports.minute = minute;
  exports.minutes = minutes;
  exports.mod = mod;
  exports.month = month;
  exports.monthDays = monthDays;
  exports.months = months;
  exports.most = most$1;
  exports.mult = mult$2;
  exports.multi = multi;
  exports.multimap = multimap;
  exports.name = name$1;
  exports.naming = naming;
  exports.nary = nary;
  exports.negatives = negatives;
  exports.next = next$a;
  exports.nextSibling = nextSibling$2;
  exports.nextSiblings = nextSiblings$2;
  exports.nil = nil;
  exports.noon = noon;
  exports.noop = noop;
  exports.not = not;
  exports.notAny = notAny;
  exports.notEmpty = notEmpty;
  exports.notEq = notEq;
  exports.notEvery = notEvery;
  exports.notSome = notSome;
  exports.nth = nth$6;
  exports.nullary = nullary;
  exports.num = num;
  exports.number = number;
  exports.numeric = numeric;
  exports.obj = obj;
  exports.okay = okay;
  exports.omit = omit$3;
  exports.once = once;
  exports.only = only;
  exports.opt = opt;
  exports.or = or;
  exports.otherwise = otherwise$3;
  exports.overlap = overlap;
  exports.overload = overload;
  exports.parent = parent$1;
  exports.parents = parents$2;
  exports.partial = partial;
  exports.partition = partition;
  exports.partitionAll = partitionAll;
  exports.partitionAll1 = partitionAll1;
  exports.partitionAll2 = partitionAll2;
  exports.partitionAll3 = partitionAll3;
  exports.partitionBy = partitionBy;
  exports.partly = partly;
  exports.patch = patch;
  exports.path = path$1;
  exports.period = period;
  exports.period1 = period1;
  exports.pipe = pipe;
  exports.pipeline = pipeline;
  exports.placeholder = placeholder;
  exports.plug = plug;
  exports.pm = pm;
  exports.positives = positives;
  exports.post = post;
  exports.pre = pre;
  exports.prepend = prepend$2;
  exports.prevSibling = prevSibling$2;
  exports.prevSiblings = prevSiblings$2;
  exports.promise = promise;
  exports.prop = prop;
  exports.protocol = protocol;
  exports.quarter = quarter;
  exports.quaternary = quaternary;
  exports.race = race;
  exports.rand = rand;
  exports.randInt = randInt;
  exports.randNth = randNth;
  exports.range = range;
  exports.rdow = rdow;
  exports.reFind = reFind;
  exports.reFindAll = reFindAll;
  exports.reMatches = reMatches;
  exports.rePattern = rePattern;
  exports.reSeq = reSeq;
  exports.readable = readable;
  exports.realize = realize;
  exports.realized = realized;
  exports.record = record;
  exports.recurrence = recurrence;
  exports.recurrence1 = recurrence1;
  exports.recurs = recurs;
  exports.redo = redo$1;
  exports.redoable = redoable$1;
  exports.reduce = reduce$f;
  exports.reduced = reduced$1;
  exports.reducekv = reducekv$b;
  exports.reducekv2 = reducekv2;
  exports.reducekv3 = reducekv3;
  exports.reducing = reducing;
  exports.reifiable = reifiable;
  exports.remove = remove$1;
  exports.removeKeys = removeKeys;
  exports.repeat = repeat;
  exports.repeatedly = repeatedly;
  exports.replace = replace;
  exports.reset = reset$1;
  exports.rest = rest$d;
  exports.revSeq = revSeq;
  exports.reverse = reverse$4;
  exports.rewrite = rewrite;
  exports.right = right;
  exports.root = root$2;
  exports.rpad = rpad;
  exports.rtrim = rtrim;
  exports.satisfies = satisfies;
  exports.scan = scan;
  exports.scanKey = scanKey;
  exports.second = second;
  exports.seconds = seconds;
  exports.see = see;
  exports.seek = seek;
  exports.selectKeys = selectKeys;
  exports.send = send;
  exports.seq = seq$a;
  exports.serieslike = serieslike;
  exports.shuffle = shuffle;
  exports.siblings = siblings$2;
  exports.signature = signature;
  exports.signatureHead = signatureHead;
  exports.slice = slice;
  exports.sod = sod;
  exports.som = som;
  exports.some = some$1;
  exports.someFn = someFn;
  exports.sort = sort;
  exports.sortBy = sortBy;
  exports.soy = soy;
  exports.specify = specify;
  exports.splice = splice;
  exports.split = split$2;
  exports.splitAt = splitAt;
  exports.splitWith = splitWith;
  exports.spread = spread;
  exports.start = start$2;
  exports.startsWith = startsWith;
  exports.state = state;
  exports.steps = steps;
  exports.str = str;
  exports.subj = subj;
  exports.subs = subs;
  exports.subset = subset;
  exports.subsumes = subsumes;
  exports.subtract = subtract;
  exports.sum = sum;
  exports.superset = superset;
  exports.swap = swap$1;
  exports.take = take;
  exports.takeLast = takeLast;
  exports.takeNth = takeNth;
  exports.takeWhile = takeWhile;
  exports.task = task;
  exports.tee = tee;
  exports.template = template;
  exports.ternary = ternary;
  exports.test = test;
  exports.thrush = thrush;
  exports.tick = tick;
  exports.time = time;
  exports.titleCase = titleCase;
  exports.toArray = toArray$7;
  exports.toDuration = toDuration$1;
  exports.toObject = toObject$3;
  exports.toPromise = toPromise;
  exports.toQueryString = toQueryString;
  exports.toggles = toggles;
  exports.trampoline = trampoline;
  exports.transduce = transduce;
  exports.transition = transition;
  exports.transitions = transitions;
  exports.transpose = transpose;
  exports.treeSeq = treeSeq;
  exports.trim = trim;
  exports.type = type;
  exports.uid = uid;
  exports.unary = unary;
  exports.unbind = unbind;
  exports.unconj = unconj$1;
  exports.undo = undo$1;
  exports.undoable = undoable$1;
  exports.union = union;
  exports.unique = unique;
  exports.unite = unite;
  exports.unreduced = unreduced;
  exports.unspecify = unspecify;
  exports.unspread = unspread;
  exports.untick = untick;
  exports.update = update;
  exports.updateIn = updateIn;
  exports.upperCase = upperCase;
  exports.upward = upward;
  exports.val = val;
  exports.vals = vals$6;
  exports.warn = warn;
  exports.weakMap = weakMap;
  exports.weekday = weekday;
  exports.weekend = weekend;
  exports.weeks = weeks;
  exports.what = what;
  exports.when = when;
  exports.withIndex = withIndex;
  exports.writable = writable;
  exports.xarg = xarg;
  exports.xargs = xargs;
  exports.yank = yank;
  exports.year = year;
  exports.years = years;
  exports.zeros = zeros;
  exports.zip = zip;

  Object.defineProperty(exports, '__esModule', { value: true });

});
