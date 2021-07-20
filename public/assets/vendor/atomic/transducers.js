define(['exports', 'atomic/core', 'set'], function (exports, _, Set) { 'use strict';

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function identity() {
    return _.identity;
  }
  function first() {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return _.reduced(rf(rf(memo, value)));
      });
    };
  }
  function last(n) {
    var size = n || 1;
    return function (rf) {
      var prior = [];
      return _.overload(rf, function (memo) {
        var acc = memo;

        var _iterator = _createForOfIteratorHelper(prior),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var x = _step.value;
            acc = rf(acc, x);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return rf(acc);
      }, function (memo, value) {
        prior.push(value);

        while (prior.length > size) {
          prior.shift();
        }

        return memo;
      });
    };
  }
  function tee(f) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        f(value);
        return rf(memo, value);
      });
    };
  }
  function scan(step, init) {
    return function (rf) {
      var acc = init;
      return _.overload(rf, rf, function (memo, value) {
        acc = step(acc, value);
        return rf(memo, acc);
      });
    };
  }

  function best2(better, init) {
    return function (rf) {
      var result = init;
      return _.overload(rf, function (memo) {
        return _.reduced(rf(rf(memo, result)));
      }, function (memo, value) {
        result = better(result, value);
        return memo;
      });
    };
  }

  function best1(better) {
    return function (rf) {
      return _.overload(rf, rf, better);
    };
  }

  var best = _.overload(null, best1, best2);
  function constantly(value) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, _) {
        return rf(memo, value);
      });
    };
  }
  function map(f) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return rf(memo, f(value));
      });
    };
  }
  function mapSome(f, pred) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return rf(memo, pred(value) ? f(value) : value);
      });
    };
  }
  function mapcat(f) {
    return _.comp(map(f), cat);
  }
  function mapIndexed(f) {
    return function (rf) {
      var idx = -1;
      return _.overload(rf, rf, function (memo, value) {
        return rf(memo, f(++idx, value));
      });
    };
  }
  function filter(pred) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return pred(value) ? rf(memo, value) : memo;
      });
    };
  }
  var remove = _.comp(filter, _.complement);
  function detect(pred) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return pred(value) ? _.reduced(rf(memo, value)) : memo;
      });
    };
  }
  function compact() {
    return filter(_.identity);
  }

  function dedupe0() {
    return dedupe1(_.identity);
  }

  function dedupe1(f) {
    return dedupe2(f, _.equiv);
  }

  function dedupe2(f, equiv) {
    var nil = {};
    return function (rf) {
      var last = nil;
      return _.overload(rf, rf, function (memo, value) {
        var result = last !== nil && equiv(f(value), f(last)) ? memo : rf(memo, value);
        last = value;
        return result;
      });
    };
  }

  var dedupe = _.overload(dedupe0, dedupe1, dedupe2);
  function take(n) {
    return function (rf) {
      var taking = n < 0 ? 0 : n;
      return _.overload(rf, rf, function (memo, value) {
        switch (taking) {
          case 0:
            return _.reduced(memo);

          case 1:
            taking--;
            return _.reduced(rf(memo, value));

          default:
            taking--;
            return rf(memo, value);
        }
      });
    };
  }
  function drop(n) {
    return function (rf) {
      var dropping = n;
      return _.overload(rf, rf, function (memo, value) {
        return dropping-- > 0 ? memo : rf(memo, value);
      });
    };
  }
  function interpose(sep) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return rf(_.seq(memo) ? rf(memo, sep) : memo, value);
      });
    };
  }
  function dropWhile(pred) {
    return function (rf) {
      var dropping = true;
      return _.overload(rf, rf, function (memo, value) {
        !dropping || (dropping = pred(value));
        return dropping ? memo : rf(memo, value);
      });
    };
  }
  function keep(f) {
    return _.comp(map(f), filter(_.isSome));
  }
  function keepIndexed(f) {
    return _.comp(mapIndexed1(f), filter(_.isSome));
  }
  function takeWhile(pred) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return pred(value) ? rf(memo, value) : _.reduced(memo);
      });
    };
  }
  function takeNth(n) {
    return function (rf) {
      var x = -1;
      return _.overload(rf, rf, function (memo, value) {
        x++;
        return x === 0 || x % n === 0 ? rf(memo, value) : memo;
      });
    };
  }
  function splay(f) {
    return function (rf) {
      return _.overload(rf, rf, function (memo, value) {
        return rf(memo, f.apply(null, value));
      });
    };
  }
  function distinct() {
    return function (rf) {
      var seen = new Set();
      return _.overload(rf, rf, function (memo, value) {
        if (seen.has(value)) {
          return memo;
        }

        seen.add(value);
        return rf(memo, value);
      });
    };
  }
  function cat(rf) {
    return _.overload(rf, rf, function (memo, value) {
      return _.reduce(memo, rf, value);
    });
  }
  function hist(limit) {
    return function (rf) {
      var history = [];
      return _.overload(rf, rf, function (memo, value) {
        var revised = _.clone(history);

        revised.unshift(value);

        if (history.length > limit) {
          revised.pop();
        }

        history = revised;
        return rf(memo, history);
      });
    };
  } //regulates message processing so, if there are side effects, each is processed before the next begins

  function isolate() {
    return function (rf) {
      var queue = [];
      return _.overload(rf, rf, function (memo, value) {
        var acc = memo;
        var ready = queue.length === 0;
        queue.push(value);

        if (ready) {
          while (queue.length) {
            try {
              acc = rf(acc, queue[0]);
            } finally {
              queue.shift();
            }
          }
        }

        return acc;
      });
    };
  }

  exports.best = best;
  exports.cat = cat;
  exports.compact = compact;
  exports.constantly = constantly;
  exports.dedupe = dedupe;
  exports.detect = detect;
  exports.distinct = distinct;
  exports.drop = drop;
  exports.dropWhile = dropWhile;
  exports.filter = filter;
  exports.first = first;
  exports.hist = hist;
  exports.identity = identity;
  exports.interpose = interpose;
  exports.isolate = isolate;
  exports.keep = keep;
  exports.keepIndexed = keepIndexed;
  exports.last = last;
  exports.map = map;
  exports.mapIndexed = mapIndexed;
  exports.mapSome = mapSome;
  exports.mapcat = mapcat;
  exports.remove = remove;
  exports.scan = scan;
  exports.splay = splay;
  exports.take = take;
  exports.takeNth = takeNth;
  exports.takeWhile = takeWhile;
  exports.tee = tee;

  Object.defineProperty(exports, '__esModule', { value: true });

});
