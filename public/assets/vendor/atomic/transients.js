define(['exports', 'atomic/core', 'set'], function (exports, _, Set) { 'use strict';

  var IPersistent = _.protocol({
    persistent: null
  });

  var persistent$2 = IPersistent.persistent;

  var ITransient = _.protocol({
    "transient": null
  });

  var _transient = ITransient["transient"];

  var ITransientAssociative = _.protocol({
    assoc: null
  });

  var assoc$2 = ITransientAssociative.assoc;

  var ITransientMap = _.protocol({
    dissoc: null
  });

  var dissoc$2 = ITransientMap.dissoc;

  var ITransientSet = _.protocol({
    disj: null
  });

  var disj$1 = ITransientSet.disj;

  var ITransientCollection = _.protocol({
    conj: null,
    unconj: null
  });

  var conj$3 = _.overload(null, _.noop, ITransientCollection.conj, _.doing(ITransientCollection.conj));
  var unconj$1 = _.overload(null, _.noop, ITransientCollection.unconj, _.doing(ITransientCollection.unconj));

  var ITransientEmptyableCollection = _.protocol({
    empty: null
  });

  var empty$3 = ITransientEmptyableCollection.empty;

  var ITransientAppendable = _.protocol({
    append: null
  });

  var append$1 = _.overload(null, _.noop, ITransientAppendable.append, _.doing(ITransientAppendable.append));

  var ITransientPrependable = _.protocol({
    prepend: null
  });

  var prepend$1 = _.overload(null, _.noop, ITransientPrependable.prepend, _.doing(ITransientPrependable.prepend, _.reverse));

  var ITransientOmissible = _.protocol({
    omit: null
  });

  var omit$1 = ITransientOmissible.omit;

  var ITransientInsertable = _.protocol({
    before: null,
    after: null
  });

  function afterN(self) {
    var ref = self;

    for (var _len = arguments.length, els = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      els[_key - 1] = arguments[_key];
    }

    while (els.length) {
      var el = els.shift();
      ITransientInsertable.after(ref, el);
      ref = el;
    }
  }

  var after$1 = _.overload(null, _.noop, ITransientInsertable.after, afterN);

  function beforeN(self) {
    var ref = self;

    for (var _len2 = arguments.length, els = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      els[_key2 - 1] = arguments[_key2];
    }

    while (els.length) {
      var el = els.pop();
      ITransientInsertable.before(ref, el);
      ref = el;
    }
  }

  var before$1 = _.overload(null, _.noop, ITransientInsertable.before, beforeN);

  var ITransientReversible = _.protocol({
    reverse: null
  });

  var reverse$1 = ITransientReversible.reverse;

  function TransientArray(arr) {
    this.arr = arr;
  }
  function transientArray(arr) {
    return new TransientArray(arr);
  }

  function before(self, reference, inserted) {
    var pos = self.arr.indexOf(reference);
    pos === -1 || self.arr.splice(pos, 0, inserted);
  }

  function after(self, reference, inserted) {
    var pos = self.arr.indexOf(reference);
    pos === -1 || self.arr.splice(pos + 1, 0, inserted);
  }

  function seq$1(self) {
    return self.arr.length ? self : null;
  }

  function append(self, value) {
    self.arr.push(value);
  }

  function prepend(self, value) {
    self.arr.unshift(value);
  }

  function unconj(self, value) {
    var pos = self.arr.lastIndexOf(value);

    if (pos > -1) {
      self.arr.splice(pos, 1);
    }
  }

  function empty$2(self) {
    self.arr = [];
  }

  function reverse(self) {
    self.arr.reverse();
  }

  function assoc$1(self, idx, value) {
    self.arr[idx] = value;
  }

  function dissoc$1(self, idx) {
    self.arr.splice(idx, 1);
  }

  function omit(self, value) {
    var pos;

    while ((pos = self.arr.indexOf(value)) > -1) {
      self.arr.splice(pos, 1);
    }
  }

  function clone$2(self) {
    return new self.constructor(_.clone(self.arr));
  }

  function persistent$1(self) {
    var arr = self.arr;
    delete self.arr;
    return arr;
  }

  var behave$4 = _.does(_.forward("arr", _.IFind, _.IMapEntry, _.IAssociative, _.IMap, _.ICoercible, _.ILookup, _.IReduce, _.IKVReduce, _.IFunctor, _.IInclusive, _.ICounted, _.ISeq, _.INext), _.implement(_.ISequential), _.implement(_.IClonable, {
    clone: clone$2
  }), _.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(IPersistent, {
    persistent: persistent$1
  }), _.implement(ITransientInsertable, {
    before: before,
    after: after
  }), _.implement(ITransientCollection, {
    conj: append,
    unconj: unconj
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty$2
  }), _.implement(ITransientOmissible, {
    omit: omit
  }), _.implement(ITransientAssociative, {
    assoc: assoc$1
  }), _.implement(ITransientReversible, {
    reverse: reverse
  }), _.implement(ITransientMap, {
    dissoc: dissoc$1
  }), _.implement(ITransientAppendable, {
    append: append
  }), _.implement(ITransientPrependable, {
    prepend: prepend
  }));

  behave$4(TransientArray);

  function TransientObject(obj) {
    this.obj = obj;
  }
  function transientObject(obj) {
    return new TransientObject(obj);
  }

  function conj$2(self, entry) {
    var key = _.key(entry),
        val = _.val(entry);

    self.obj[key] = val;
  }

  function dissoc(self, key) {
    if (_.contains(self, key)) {
      delete self.obj[key];
    }
  }

  function assoc(self, key, value) {
    if (!_.contains(self, key) || !_.equiv(_.get(self, key), value)) {
      self.obj[key] = value;
    }
  }

  function clone$1(self) {
    return new self.constructor(_.clone(self.obj));
  }

  function compare(a, b) {
    return _.compare(a.obj, b == null ? null : b.obj);
  }

  function equiv(a, b) {
    return _.equiv(a.obj, b == null ? null : b.obj);
  }

  function toObject(self) {
    return self.obj;
  }

  function empty$1(self) {
    self.obj = {};
  }

  function persistent(self) {
    var obj = self.obj;
    delete self.obj;
    return obj;
  }

  var behave$3 = _.does(_.forward("obj", _.IMap, _.IFind, _.IInclusive, _.ILookup, _.ISeq, _.INext, _.IAssociative, _.ISeqable, _.ICounted, _.IReduce, _.IKVReduce, _.ICoercible), _.implement(_.IComparable, {
    compare: compare
  }), _.implement(_.ICoercible, {
    toObject: toObject
  }), _.implement(_.IFn, {
    invoke: _.get
  }), _.implement(_.IClonable, {
    clone: clone$1
  }), _.implement(_.IEquiv, {
    equiv: equiv
  }), _.implement(IPersistent, {
    persistent: persistent
  }), _.implement(ITransientCollection, {
    conj: conj$2
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty$1
  }), _.implement(ITransientAssociative, {
    assoc: assoc
  }), _.implement(ITransientMap, {
    dissoc: dissoc
  }));

  behave$3(TransientObject);

  var TransientSet = Set;
  function transientSet(entries) {
    return new TransientSet(entries || []);
  }
  function emptyTransientSet() {
    return new TransientSet();
  }

  function seq(self) {
    return count(self) ? self : null;
  }

  function empty(self) {
    self.clear();
  }

  function disj(self, value) {
    self["delete"](value);
  }

  function includes(self, value) {
    return self.has(value);
  }

  function conj$1(self, value) {
    self.add(value);
  }

  function first(self) {
    return self.values().next().value;
  }

  function rest(self) {
    var iter = self.values();
    iter.next();
    return _.lazyIterable(iter);
  }

  function next(self) {
    var iter = self.values();
    iter.next();
    return _.lazyIterable(iter, null);
  }

  function count(self) {
    return self.size;
  }

  var toArray = Array.from;

  function clone(self) {
    return new self.constructor(toArray(self));
  }

  function reduce(self, f, init) {
    var memo = init;
    var coll = seq(self);

    while (coll) {
      memo = f(memo, first(coll));
      coll = next(coll);
    }

    return _.unreduced(memo);
  }

  var behave$2 = _.does(_.implement(_.ISequential), _.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(_.ICoercible, {
    toArray: toArray
  }), _.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.IClonable, {
    clone: clone
  }), _.implement(_.ICounted, {
    count: count
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty
  }), _.implement(ITransientCollection, {
    conj: conj$1
  }), _.implement(ITransientSet, {
    disj: disj
  })); //TODO unite

  behave$2(TransientSet);

  function Method(pred, f) {
    this.pred = pred;
    this.f = f;
  }
  function method(pred, f) {
    return new Method(pred, f);
  }

  function invoke$1(self, args) {
    return _.apply(self.f, args);
  }

  function handles$1(self, args) {
    return _.apply(self.pred, args);
  }

  var behave$1 = _.does(_.implement(_.IHandler, {
    handles: handles$1
  }), _.implement(_.IFn, {
    invoke: invoke$1
  }));

  behave$1(Method);

  function surrogate(f, substitute) {
    return function (self) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      f.apply(null, [substitute].concat(args));
      return self;
    };
  }

  function Multimethod(methods, fallback) {
    this.methods = methods;
    this.fallback = fallback;
  }
  function multimethod(fallback) {
    var instance = new Multimethod([], fallback ? method(_.constantly(true), fallback) : null),
        fn = _.partial(_.invoke, instance),
        conj = surrogate(conj$3, instance);

    return _.doto(fn, _.specify(ITransientCollection, {
      conj: conj
    }));
  }

  function conj(self, method) {
    self.methods.push(method);
  }

  function handles(self, args) {
    var _args, _$handles, _ref;

    return _.detect((_ref = _, _$handles = _ref.handles, _args = args, function handles(_argPlaceholder) {
      return _$handles.call(_ref, _argPlaceholder, _args);
    }), self.methods) || self.fallback;
  }

  function invoke(self) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var method = handles(self, args);

    if (method) {
      return _.invoke(method, args);
    } else {
      throw new Error("No suitable method for args.");
    }
  }

  var behave = _.does(_.implement(_.IFn, {
    invoke: invoke
  }), _.implement(ITransientCollection, {
    conj: conj
  }));

  behave(Multimethod);

  function toTransient(Type, construct) {
    function _transient(self) {
      return construct(_.clone(self));
    }

    _.doto(Type, _.implement(ITransient, {
      "transient": _transient
    }));
  }

  toTransient(Object, transientObject);
  toTransient(Array, transientArray);
  toTransient(Set, transientSet);
  function withMutations(self, f) {
    return persistent$2(f(_transient(self)));
  }

  exports.IPersistent = IPersistent;
  exports.ITransient = ITransient;
  exports.ITransientAppendable = ITransientAppendable;
  exports.ITransientAssociative = ITransientAssociative;
  exports.ITransientCollection = ITransientCollection;
  exports.ITransientEmptyableCollection = ITransientEmptyableCollection;
  exports.ITransientInsertable = ITransientInsertable;
  exports.ITransientMap = ITransientMap;
  exports.ITransientOmissible = ITransientOmissible;
  exports.ITransientPrependable = ITransientPrependable;
  exports.ITransientReversible = ITransientReversible;
  exports.ITransientSet = ITransientSet;
  exports.Method = Method;
  exports.Multimethod = Multimethod;
  exports.TransientArray = TransientArray;
  exports.TransientObject = TransientObject;
  exports.TransientSet = TransientSet;
  exports.after = after$1;
  exports.append = append$1;
  exports.assoc = assoc$2;
  exports.before = before$1;
  exports.conj = conj$3;
  exports.disj = disj$1;
  exports.dissoc = dissoc$2;
  exports.empty = empty$3;
  exports.emptyTransientSet = emptyTransientSet;
  exports.method = method;
  exports.multimethod = multimethod;
  exports.omit = omit$1;
  exports.persistent = persistent$2;
  exports.prepend = prepend$1;
  exports.reverse = reverse$1;
  exports.transient = _transient;
  exports.transientArray = transientArray;
  exports.transientObject = transientObject;
  exports.transientSet = transientSet;
  exports.unconj = unconj$1;
  exports.withMutations = withMutations;

  Object.defineProperty(exports, '__esModule', { value: true });

});
