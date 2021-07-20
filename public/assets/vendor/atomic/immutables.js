define(['exports', 'atomic/core', 'atomic/transients', 'immutable', 'symbol'], function (exports, _, mut, imm, _Symbol) { 'use strict';

  function set(coll) {
    return coll instanceof imm.Set ? coll : new imm.Set(_.toArray(coll));
  }
  function emptySet() {
    return new imm.Set();
  }

  function map(obj) {
    return obj instanceof imm.Map ? obj : new imm.Map(obj);
  }

  var IHash = _.protocol({
    //hashing is an algorithm for improved immutable lookup and is not intended for mutables.
    hash: null
  });

  function list(obj) {
    return obj instanceof imm.List ? obj : new imm.List(obj);
  }

  function equiv$1(self, other) {
    return self.equals(other);
  }

  function includes$1(self, value) {
    return self.includes(value);
  }

  function lookup$1(self, idx) {
    return self.get(idx);
  }

  function assoc$1(self, idx, value) {
    return self.set(idx, value);
  }

  function contains$1(self, idx) {
    return self.has(idx);
  }

  function conj$1(self, value) {
    return self.push(value);
  }

  function first$3(self) {
    return self.first();
  }

  function rest$3(self) {
    return self.rest();
  }

  function next$3(self) {
    return _.seq(rest$3(self));
  }

  function empty(self) {
    return self.clear();
  }

  function count$2(self) {
    return self.count();
  }

  function seq$2(self) {
    return self.size ? self : null;
  }

  function toArray$2(self) {
    return self.toArray();
  }

  function reduce$1(self, f, init) {
    var memo = init;

    var coll = _.seq(self);

    while (coll) {
      memo = f(memo, _.first(coll));
      coll = _.next(coll);
    }

    return _.unreduced(memo);
  }

  function merge$2(self, other) {
    return _.reduce(_.conj, self, other);
  }

  var behave$3 = _.does(_.iterable, _.implement(_.IEquiv, {
    equiv: equiv$1
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(_.IAssociative, {
    assoc: assoc$1,
    contains: contains$1
  }), _.implement(_.ILookup, {
    lookup: lookup$1
  }), _.implement(_.IReduce, {
    reduce: reduce$1
  }), _.implement(_.INext, {
    next: next$3
  }), _.implement(_.ICoercible, {
    toArray: toArray$2
  }), _.implement(_.IMergable, {
    merge: merge$2
  }), _.implement(_.IEmptyableCollection, {
    empty: empty
  }), _.implement(_.IClonable, {
    clone: _.identity
  }), _.implement(_.ISeqable, {
    seq: seq$2
  }), _.implement(_.ICounted, {
    count: count$2
  }), _.implement(_.ICollection, {
    conj: conj$1
  }), _.implement(_.ISeq, {
    first: first$3,
    rest: rest$3
  }));

  behave$3(imm.List);

  function assoc(self, key, value) {
    return self.set(key, value);
  }

  function contains(self, key) {
    return self.has(key);
  }

  function lookup(self, key) {
    return self.get(key);
  }

  function count$1(self) {
    return self.size;
  }

  function keys(self) {
    return _.lazyIterable(self.keys());
  }

  function vals(self) {
    return _.lazyIterable(self.values());
  }

  function dissoc(self, key) {
    return self.remove(self, key);
  }

  function reducekv(self, f, init) {
    return _.reduce(function (memo, key) {
      return f(memo, key, _.get(self, key));
    }, init, keys(self));
  }

  function toArray$1(self) {
    return self.toArray();
  }

  function merge$1(self, other) {
    return _.reducekv(_.assoc, self, other);
  }

  function seq$1(self) {
    return self.size ? _.lazyIterable(self.entries()) : null;
  }

  function first$2(self) {
    return _.first(seq$1(self));
  }

  function rest$2(self) {
    return _.rest(seq$1(self));
  }

  function next$2(self) {
    return _.seq(rest$2(self));
  }

  var behave$2 = _.does(_.iterable, _.implement(_.IKVReduce, {
    reducekv: reducekv
  }), _.implement(_.ICoercible, {
    toArray: toArray$1
  }), _.implement(_.IMergable, {
    merge: merge$1
  }), _.implement(_.INext, {
    next: next$2
  }), _.implement(_.ISeq, {
    first: first$2,
    rest: rest$2
  }), _.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(_.IMap, {
    keys: keys,
    vals: vals,
    dissoc: dissoc
  }), _.implement(_.IClonable, {
    clone: _.identity
  }), _.implement(_.ICounted, {
    count: count$1
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(_.IAssociative, {
    assoc: assoc,
    contains: contains
  }));

  behave$2(imm.Map);

  function distinct2(coll, seen) {
    return _.seq(coll) ? _.lazySeq(function () {
      var xs = coll;

      while (_.seq(xs)) {
        var x = _.first(xs);

        xs = _.rest(xs);

        if (!_.includes(seen, x)) {
          return _.cons(x, distinct2(xs, _.conj(seen, x)));
        }
      }

      return _.emptyList();
    }) : _.emptyList();
  }

  function distinct(coll) {
    return distinct2(coll, set());
  }

  function _transient(self) {
    return mut.transientSet(toArray(self));
  }

  function seq(self) {
    return count(self) ? self : null;
  }

  function toArray(self) {
    return self.toArray();
  }

  function includes(self, value) {
    return self.has(value);
  }

  function conj(self, value) {
    return self.add(value);
  }

  function disj(self, value) {
    return self["delete"](value);
  }

  function first$1(self) {
    return self.first();
  }

  function rest$1(self) {
    var tail = self.rest();
    return tail.size > 0 ? tail : emptySet();
  }

  function next$1(self) {
    var tail = self.rest();
    return tail.size > 0 ? tail : null;
  }

  function count(self) {
    return self.size;
  }

  function reduce(self, f, init) {
    var memo = init;

    var coll = _.seq(self);

    while (coll) {
      memo = f(memo, _.first(coll));
      coll = _.next(coll);
    }

    return _.unreduced(memo);
  }

  function merge(self, other) {
    return reduce(other, _.conj, self);
  }

  function equiv(self, other) {
    return _.count(_.union(self, other)) === count(self);
  }

  var behave$1 = _.does(_.iterable, _.implement(_.ISequential), _.implement(_.IEquiv, {
    equiv: equiv
  }), _.implement(_.IAssociative, {
    contains: includes
  }), _.implement(_.IMergable, {
    merge: merge
  }), _.implement(mut.ITransient, {
    "transient": _transient
  }), _.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(_.ICoercible, {
    toArray: toArray
  }), _.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.ISet, {
    disj: disj,
    unite: conj
  }), _.implement(_.IClonable, {
    clone: _.identity
  }), _.implement(_.IEmptyableCollection, {
    empty: emptySet
  }), _.implement(_.ICollection, {
    conj: conj
  }), _.implement(_.ICounted, {
    count: count
  }), _.implement(_.INext, {
    next: next$1
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }));

  behave$1(imm.Set);

  function orderedMap(obj) {
    return obj instanceof imm.OrderedMap ? obj : new imm.OrderedMap(obj);
  }

  behave$2(imm.OrderedMap);

  function orderedSet(coll) {
    return coll instanceof imm.OrderedSet ? coll : new imm.OrderedSet(_.toArray(coll));
  }
  function emptyOrderedSet() {
    return new imm.OrderedSet();
  }

  behave$1(imm.OrderedSet);

  function Members(items) {
    this.items = items;
  }
  function members(self) {
    return new Members(distinct(_.satisfies(_.ISequential, self) ? self : _.cons(self)));
  }
  function emptyMembers() {
    return new Members();
  }

  function fmap(self, f) {
    return members(_.mapcat(function (item) {
      var result = f(item);
      return _.satisfies(_.ISequential, result) ? result : [result];
    }, self.items));
  }

  function first(self) {
    return _.first(self.items);
  }

  function rest(self) {
    var result = next(self);
    return result ? members(result) : emptyMembers();
  }

  function next(self) {
    var result = _.next(self.items);

    return result ? members(result) : null;
  }

  var behave = _.does(_.serieslike, _.implement(_.INext, {
    next: next
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(_.IFunctor, {
    fmap: fmap
  }));

  behave(Members);

  var hash = IHash.hash;

  function memoize2(f, hash) {
    var c = _Symbol("cache");

    return function (self) {
      var cache = self[c] || map(),
          key = hash.apply(self, arguments),
          result = _.contains(cache, key) ? _.get(cache, key) : f.apply(self, arguments);
      self[c] = _.assoc(cache, key, result);
      return result;
    };
  }

  function memoize1(f) {
    return memoize2(f, function (self) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return args;
    });
  }

  var memoize = _.overload(null, memoize1, memoize2);

  (function () {
    function persistent(self) {
      return set(_.toArray(self));
    }

    _.doto(mut.TransientSet, _.implement(mut.IPersistent, {
      persistent: persistent
    }));
  })();

  var cache = _Symbol["for"]("hashCode");

  function cachedHashCode() {
    var result = this[cache] || hash(this);

    if (!Object.isFrozen(this) && this[cache] == null) {
      this[cache] = result;
    }

    return result;
  }

  function hashCode() {
    return hash(this);
  }

  function equals(other) {
    return _.equiv(this, other);
  }

  function addProp(obj, key, value) {
    if (obj.hasOwnProperty(key)) {
      throw new Error("Property `" + key + "` already defined on " + obj.constructor.name + ".");
    } else {
      Object.defineProperty(obj, key, {
        value: value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  } // There be dragons! Integrate with Immutable. Object literals despite their use elsewhere are, in this world, immutable.


  addProp(Object.prototype, "hashCode", cachedHashCode);
  addProp(Object.prototype, "equals", equals);
  addProp(Number.prototype, "hashCode", hashCode);
  addProp(String.prototype, "hashCode", hashCode);
  function hashable() {
    function hash(self) {
      var content = [self.constructor.name],
          keys = Object.keys(self);

      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var key = _keys[_i];
        content.push(key, self[key]);
      }

      return hashing(content);
    }

    return _.implement(IHash, {
      hash: hash
    });
  }
  function hashed(hs) {
    return _.reduce(function (h1, h2) {
      return 3 * h1 + h2;
    }, 0, hs);
  }
  function hashing(os) {
    return hashed(_.map(hash, os));
  }

  (function () {
    function hash(self) {
      return self.valueOf();
    }

    _.each(_.implement(IHash, {
      hash: hash
    }), [Date]);
  })();

  (function () {
    _.each(_.implement(IHash, {
      hash: hashing
    }), [Array, _.Concatenated, _.List, _.EmptyList]);
  })();

  (function () {
    _.each(_.implement(IHash, {
      hash: _.constantly(imm.hash(null))
    }), [_.Nil]);
  })();

  (function () {
    var seed = _.generate(_.positives);

    var uniques = _.weakMap();

    function hash(self) {
      if (!uniques.has(self)) {
        uniques.set(self, seed());
      }

      return uniques.get(self);
    }

    _.each(_.implement(IHash, {
      hash: hash
    }), [Function]);
  })();

  (function () {
    function hash(self) {
      return _.reduce(function (memo, key) {
        return hashing([memo, key, _.get(self, key)]);
      }, 0, _.sort(_.keys(self)));
    }

    _.each(_.implement(IHash, {
      hash: hash
    }), [Object, _.AssociativeSubset, _.Indexed, _.IndexedSeq]);
  })();

  (function () {
    _.each(_.implement(IHash, {
      hash: imm.hash
    }), [String, Number, Boolean]);
  })();

  (function () {
    function hash$1(self) {
      return hash(self.id);
    }

    _.doto(_.GUID, _.implement(IHash, {
      hash: hash$1
    }));
  })();

  Object.defineProperty(exports, 'List', {
    enumerable: true,
    get: function () {
      return imm.List;
    }
  });
  Object.defineProperty(exports, 'OrderedMap', {
    enumerable: true,
    get: function () {
      return imm.OrderedMap;
    }
  });
  Object.defineProperty(exports, 'OrderedSet', {
    enumerable: true,
    get: function () {
      return imm.OrderedSet;
    }
  });
  exports.IHash = IHash;
  exports.Members = Members;
  exports.distinct = distinct;
  exports.emptyMembers = emptyMembers;
  exports.emptyOrderedSet = emptyOrderedSet;
  exports.emptySet = emptySet;
  exports.hash = hash;
  exports.hashable = hashable;
  exports.hashed = hashed;
  exports.hashing = hashing;
  exports.list = list;
  exports.map = map;
  exports.members = members;
  exports.memoize = memoize;
  exports.orderedMap = orderedMap;
  exports.orderedSet = orderedSet;
  exports.set = set;

  Object.defineProperty(exports, '__esModule', { value: true });

});
