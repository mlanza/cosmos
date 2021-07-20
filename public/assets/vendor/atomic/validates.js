define(['exports', 'atomic/core', 'promise'], function (exports, _, Promise$1) { 'use strict';

  function Annotation(note, constraint) {
    this.note = note;
    this.constraint = constraint;
  }
  function anno(note, constraint) {
    return new Annotation(note, constraint);
  }

  function Catches(constraint) {
    this.constraint = constraint;
  }
  function catches(constraint) {
    return new Catches(constraint);
  }

  function Map(f, constraint) {
    this.f = f;
    this.constraint = constraint;
  }
  function map(f, constraint) {
    return new Map(f, constraint);
  }

  var ICheckable = _.protocol({
    check: null
  });

  function parses(parse, constraint) {
    return anno({
      type: 'parse',
      parse: parse
    }, catches(map(_.branch(_.isString, parse, _.identity), constraint)));
  }

  function check3(self, parse, value) {
    return ICheckable.check(parses(parse, self), value);
  }

  var check$f = _.awaits(_.overload(null, null, ICheckable.check, check3));

  var IConstrainable = _.protocol({
    //constraints are validation which expose their data for use iby the UI
    constraints: null
  });

  function constraints2(self, f) {
    return IConstrainable.constraints(self, _.isFunction(f) ? f(IConstrainable.constraints(self)) : f);
  }

  var constraints = _.overload(null, IConstrainable.constraints, constraints2);
  function constrain(self, constraint) {
    var _constraint, _$append, _ref;

    return constraints(self, (_ref = _, _$append = _ref.append, _constraint = constraint, function append(_argPlaceholder) {
      return _$append.call(_ref, _argPlaceholder, _constraint);
    }));
  }

  var IExplains = _.protocol({
    explain: null
  });

  var explain$1 = IExplains.explain;

  var IScope = _.protocol({
    scope: null,
    at: null
  });

  var scope$1 = IScope.scope;
  var at$1 = IScope.at;

  var ISelection = _.protocol({
    options: null
  });

  var options$2 = ISelection.options;

  var p = /*#__PURE__*/Object.freeze({
    __proto__: null,
    parses: parses,
    check: check$f,
    constraints: constraints,
    constrain: constrain,
    explain: explain$1,
    scope: scope$1,
    at: at$1,
    options: options$2
  });

  function And(constraints) {
    this.constraints = constraints;
  }
  function and() {
    for (var _len = arguments.length, constraints = new Array(_len), _key = 0; _key < _len; _key++) {
      constraints[_key] = arguments[_key];
    }

    return new And(constraints);
  }

  function Issue(constraint, path) {
    this.constraint = constraint;
    this.path = path;
  }
  function issue(constraint, path) {
    return new Issue(constraint, path || null);
  }

  function issues1(obj) {
    return _.seq(check$f(constraints(obj), obj));
  }

  function issues2(xs, f) {
    if (xs == null) {
      return null;
    } else if (_.isPromise(xs)) {
      return _.fmap(xs, function (x) {
        return issues2(x, f);
      });
    } else if (_.satisfies(_.ISeqable, xs)) {
      var _ref, _ref2, _ref3, _ref4, _xs, _f, _$map, _ref5;

      return _ref = (_ref2 = (_ref3 = (_ref4 = (_xs = xs, _.seq(_xs)), (_ref5 = _, _$map = _ref5.map, _f = f, function map(_argPlaceholder) {
        return _$map.call(_ref5, _f, _argPlaceholder);
      })(_ref4)), _.flatten(_ref3)), _.compact(_ref2)), _.blot(_ref);
    }
  }

  var issues = _.overload(null, issues1, issues2);

  function issuing2(x, issue) {
    return issuing3(x, _.identity, issue);
  }

  function issuing3(x, valid, issue) {
    if (_.isPromise(x)) {
      var _valid, _issue, _issuing;

      return _.fmap(x, valid, (_issuing = issuing, _valid = valid, _issue = issue, function issuing(_argPlaceholder2) {
        return _issuing(_argPlaceholder2, _valid, _issue);
      }));
    } else if (valid(x)) {
      return null;
    } else {
      return [issue];
    }
  }

  var issuing = _.overload(null, null, issuing2, issuing3);

  function deref$1(self) {
    return self.constraint;
  }

  function scope(self, key) {
    return issue(self.constraint, _.toArray(_.cons(key, self.path)));
  }

  function at(self, path) {
    return issue(self.constraint, path);
  }

  var behave$f = _.does(_.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(IScope, {
    scope: scope,
    at: at
  }));

  behave$f(Issue);

  function check$e(self, value) {
    var _value, _p$check, _p;

    return issues(self.constraints, (_p = p, _p$check = _p.check, _value = value, function check(_argPlaceholder) {
      return _p$check.call(_p, _argPlaceholder, _value);
    }));
  }

  function conj$1(self, constraint) {
    return _.apply(and, _.conj(self.constraints, constraint));
  }

  function first$1(self) {
    return _.first(self.constraints);
  }

  function rest$1(self) {
    return _.rest(self.constraints);
  }

  function empty$1(self) {
    return and();
  }

  function seq$1(self) {
    return _.seq(self.constraints) ? self : null;
  }

  function next$1(self) {
    return _.seq(rest$1(self));
  }

  var behave$e = _.does(_.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(_.INext, {
    next: next$1
  }), _.implement(_.IEmptyableCollection, {
    empty: empty$1
  }), _.implement(_.ICollection, {
    conj: conj$1
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }), _.implement(_.IAppendable, {
    append: conj$1
  }), _.implement(ICheckable, {
    check: check$e
  }));

  behave$e(And);

  function deref(self) {
    return self.constraint;
  }

  function explain(self) {
    return self.note;
  }

  function check$d(self, value) {
    return issues(check$f(self.constraint, value), function (iss) {
      return issue(anno(self.note, iss.constraint), iss.path);
    });
  }

  function append$2(self, constraint) {
    return anno(self.note, _.append(self.constraint, constraint));
  }

  var behave$d = _.does(_.implement(_.IDeref, {
    deref: deref
  }), _.implement(IExplains, {
    explain: explain
  }), _.implement(_.IAppendable, {
    append: append$2
  }), _.implement(ICheckable, {
    check: check$d
  }));

  behave$d(Annotation);

  function Bounds(start, end, f) {
    this.start = start;
    this.end = end;
    this.f = f;
  }

  function bounds3(start, end, f) {
    return new Bounds(start, end, f);
  }

  function bounds2(start, end) {
    return bounds3(start, end, _.identity);
  }

  function bounds1(end) {
    return bounds2(null, end);
  }

  var bounds = _.overload(null, bounds1, bounds2, bounds3);

  function start$1(self) {
    return self.start;
  }

  function end$1(self) {
    return self.end;
  }

  function includes$1(self, value) {
    return _.between(self, value);
  }

  function check$c(self, obj) {
    var value = self.f(obj);
    return self.start != null && value <= self.start || self.end != null && value >= self.end ? [issue(self)] : null;
  }

  var behave$c = _.does(_.implement(ICheckable, {
    check: check$c
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(_.IBounds, {
    start: start$1,
    end: end$1
  }));

  behave$c(Bounds);

  function Cardinality(least, most) {
    this.least = least;
    this.most = most;
  }

  function validCardinality(least, most) {
    return _.isInteger(least) && least >= 0 && most >= 0 && least <= most && (_.isInteger(most) || most === Infinity);
  }

  var card = _.fnil(_.pre(_.constructs(Cardinality), validCardinality), 0, Infinity);
  var opt = card(0, 1);
  var req = card(1, 1);
  var unlimited = card(0, Infinity);

  function start(self) {
    return self.least;
  }

  function end(self) {
    return self.most;
  }

  function includes(self, value) {
    return _.isInteger(value) && _.between(self, value);
  }

  function check$b(self, coll) {
    var n = _.count(coll);

    return n < self.least || n > self.most ? [issue(self)] : null;
  }

  var behave$b = _.does(_.implement(ICheckable, {
    check: check$b
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.IBounds, {
    start: start,
    end: end
  }));

  behave$b(Cardinality);

  function check$a(self, obj) {
    try {
      return check$f(self.constraint, obj);
    } catch (ex) {
      return [issue(self)];
    }
  }

  var behave$a = _.does(_.implement(ICheckable, {
    check: check$a
  }));

  behave$a(Catches);

  function Characters(start, end, f) {
    this.start = start;
    this.end = end;
    this.f = f;
  }

  function chars2(start, end) {
    return new Characters(start, end, _.count);
  }

  function chars1(end) {
    return chars2(null, end);
  }

  var chars = _.overload(null, chars1, chars2);

  behave$c(Characters);

  function Choice(options) {
    this.options = options;
  }
  function choice(options) {
    return new Choice(options);
  }

  function options$1(self) {
    return self.options;
  }

  function check$9(self, value) {
    return _.includes(self.options, value) ? null : [issue(self)];
  }

  var behave$9 = _.does(_.implement(ISelection, {
    options: options$1
  }), _.implement(ICheckable, {
    check: check$9
  }));

  behave$9(Choice);

  function CollOf(constraint) {
    this.constraint = constraint;
  }
  function collOf(constraint) {
    return new CollOf(constraint);
  }

  function check$8(self, coll) {
    var _param, _$mapIndexed, _ref;

    return _.maybe(coll, (_ref = _, _$mapIndexed = _ref.mapIndexed, _param = function _param(idx, item) {
      var _idx, _p$scope, _p;

      return _.map((_p = p, _p$scope = _p.scope, _idx = idx, function scope(_argPlaceholder2) {
        return _p$scope.call(_p, _argPlaceholder2, _idx);
      }), check$f(self.constraint, item));
    }, function mapIndexed(_argPlaceholder) {
      return _$mapIndexed.call(_ref, _param, _argPlaceholder);
    }), _.concatenated, _.compact, _.toArray, _.blot);
  }

  var behave$8 = _.does(_.implement(ICheckable, {
    check: check$8
  }));

  behave$8(CollOf);

  function Isa(types) {
    this.types = types;
  }
  function isa() {
    for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    return new Isa(types);
  }

  function check$7(self, obj) {
    var _obj, _$is, _ref;

    return _.some((_ref = _, _$is = _ref.is, _obj = obj, function is(_argPlaceholder) {
      return _$is.call(_ref, _obj, _argPlaceholder);
    }), self.types) ? null : [issue(self)];
  }

  function options(self) {
    return self.types;
  }

  var behave$7 = _.does(_.implement(ISelection, {
    options: options
  }), _.implement(ICheckable, {
    check: check$7
  }));

  behave$7(Isa);

  function check$6(self, obj) {
    try {
      var value = _.invoke(self.f, obj);

      return check$f(self.constraint, value);
    } catch (ex) {
      return [issue(self.constraint)];
    }
  }

  var behave$6 = _.does(_.implement(ICheckable, {
    check: check$6
  }));

  behave$6(Map);

  function Optional(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function optional(key, constraint) {
    return new Optional(key, constraint || null);
  }

  function check$5(self, obj) {
    var found = _.get(obj, self.key);

    if (_.blank(found)) {
      return null;
    } else {
      var _self$key, _p$scope, _p;

      return issues(check$f(self.constraint, found), (_p = p, _p$scope = _p.scope, _self$key = self.key, function scope(_argPlaceholder) {
        return _p$scope.call(_p, _argPlaceholder, _self$key);
      }));
    }
  }

  function append$1(self, constraint) {
    return optional(self.key, and(self.constraint, constraint));
  }

  var behave$5 = _.does(_.implement(_.IAppendable, {
    append: append$1
  }), _.implement(ICheckable, {
    check: check$5
  }));

  behave$5(Optional);

  function Or(constraints) {
    this.constraints = constraints;
  }
  function or() {
    for (var _len = arguments.length, constraints = new Array(_len), _key = 0; _key < _len; _key++) {
      constraints[_key] = arguments[_key];
    }

    return new Or(constraints);
  }

  function check$4(self, value) {
    var _value, _p$check, _p;

    return _.detect(_.isSome, _.map((_p = p, _p$check = _p.check, _value = value, function check(_argPlaceholder) {
      return _p$check.call(_p, _argPlaceholder, _value);
    }), self.constraints));
  }

  function conj(self, constraint) {
    return _.apply(or, _.conj(self.constraints, constraint));
  }

  function first(self) {
    return _.first(self.constraints);
  }

  function rest(self) {
    return _.rest(self.constraints);
  }

  function empty(self) {
    return or();
  }

  function seq(self) {
    return _.seq(self.constraints) ? self : null;
  }

  function next(self) {
    return _.seq(rest(self));
  }

  var behave$4 = _.does(_.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.IEmptyableCollection, {
    empty: empty
  }), _.implement(_.ICollection, {
    conj: conj
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(_.IAppendable, {
    append: conj
  }), _.implement(ICheckable, {
    check: check$4
  }));

  behave$4(Or);

  function Predicate(f, args) {
    this.f = f;
    this.args = args;
  }
  function pred(f) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return new Predicate(f, args);
  }

  function check$3(self, obj) {
    var pos = _.indexOf(self.args, null),
        args = _.assoc(self.args, pos, obj);

    return _.apply(self.f, args) ? null : [issue(self)];
  }

  var behave$3 = _.does(_.implement(ICheckable, {
    check: check$3
  }));

  behave$3(Predicate);

  function Required(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function required(key, constraint) {
    return new Required(key, constraint || null);
  }

  function check$2(self, obj) {
    var found = _.get(obj, self.key);

    if (_.blank(found)) {
      return [issue(self, [self.key])];
    } else {
      var _self$key, _p$scope, _p;

      return issues(check$f(self.constraint, found), (_p = p, _p$scope = _p.scope, _self$key = self.key, function scope(_argPlaceholder) {
        return _p$scope.call(_p, _argPlaceholder, _self$key);
      }));
    }
  }

  function append(self, constraint) {
    return required(self.key, and(self.constraint, constraint));
  }

  var behave$2 = _.does(_.implement(_.IAppendable, {
    append: append
  }), _.implement(ICheckable, {
    check: check$2
  }));

  behave$2(Required);

  function Scoped(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function scoped(key, constraint) {
    return new Scoped(key, constraint);
  }

  function check$1(self, value) {
    return issues(check$f(self.constraint, value), function (iss) {
      return issue(self.constraint, _.toArray(_.cons(self.key, iss.path)));
    });
  }

  var behave$1 = _.does(_.implement(ICheckable, {
    check: check$1
  }));

  behave$1(Scoped);

  function When(pred, constraint) {
    this.pred = pred;
    this.constraint = constraint;
  }
  function when(pred, constraint) {
    return new When(pred, constraint);
  }

  function check(self, obj) {
    return self.pred(obj) ? check$f(self.constraint, obj) : null;
  }

  var behave = _.does(_.implement(ICheckable, {
    check: check
  }));

  behave(When);

  function toPred(constraint) {
    return function (obj) {
      var issues = check$f(constraint, obj);
      return !issues;
    };
  }
  function present(constraint) {
    return or(_.isNil, constraint);
  }
  function atLeast(n) {
    return anno({
      type: 'at-least',
      n: n
    }, map(_.count, pred(_.gte, null, n)));
  }
  function atMost(n) {
    return anno({
      type: 'at-most',
      n: n
    }, map(_.count, pred(_.lte, null, n)));
  }
  function exactly(n) {
    return anno({
      type: 'exactly',
      n: n
    }, map(_.count, pred(_.eq, null, n)));
  }
  function between(min, max) {
    return min == max ? anno({
      type: 'equal',
      value: min
    }, pred(_.eq, null, min)) : anno({
      type: 'between',
      min: min,
      max: max
    }, or(anno({
      type: 'min',
      min: min
    }, pred(_.gte, null, min)), anno({
      type: 'max',
      max: max
    }, pred(_.lte, null, max))));
  }
  function keyed(keys) {
    return _.apply(_.juxt, _.mapa(function (key) {
      var _key, _$get, _ref;

      return _ref = _, _$get = _ref.get, _key = key, function get(_argPlaceholder) {
        return _$get.call(_ref, _argPlaceholder, _key);
      };
    }, keys));
  }
  function supplied(cond, keys) {
    return scoped(_.first(keys), map(keyed(keys), _.spread(_.filled(cond, _.constantly(true)))));
  }
  function range(start, end) {
    return anno({
      type: 'range',
      start: start,
      end: end
    }, supplied(_.lte, [start, end]));
  }
  var email = anno({
    type: "email"
  }, /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
  var phone = anno({
    type: "phone"
  }, /^(\d{3}-|\(\d{3}\) )\d{3}-\d{4}$/);
  var stateCode = anno({
    type: "state-code"
  }, choice(['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']));
  var zipCode = anno({
    type: "zip-code"
  }, /^\d{5}(-\d{4})?$/);

  (function () {
    var check = _.constantly(null);

    _.doto(_.Nil, _.implement(ICheckable, {
      check: check
    }));
  })();

  function datatype(Type, pred, type) {
    function check(self, value) {
      return pred(value) ? null : [issue(Type)];
    }

    var explain = _.constantly({
      type: type
    });

    _.doto(Type, _.specify(IExplains, {
      explain: explain
    }), _.specify(ICheckable, {
      check: check
    }));
  }
  datatype(Function, _.isFunction, "function");
  datatype(Number, _.isNumber, "number");
  datatype(Date, _.isDate, "date");
  datatype(String, _.isString, "string");
  datatype(RegExp, _.isRegExp, "regexp");
  datatype(_.Nil, _.isNil, "nil");

  (function () {
    function check(self, value) {
      return self.test(value) ? null : [issue(self)];
    }

    _.doto(RegExp, _.implement(IExplains, {
      explain: _.constantly({
        type: "pattern"
      })
    }), _.implement(ICheckable, {
      check: check
    }));
  })();

  (function () {
    function check(self, value) {
      return issuing(self(value), issue(self));
    }

    _.doto(Function, _.implement(IExplains, {
      explain: _.constantly({
        type: "predicate"
      })
    }), _.implement(ICheckable, {
      check: check
    }));
  })();

  exports.And = And;
  exports.Annotation = Annotation;
  exports.Bounds = Bounds;
  exports.Cardinality = Cardinality;
  exports.Catches = Catches;
  exports.Characters = Characters;
  exports.Choice = Choice;
  exports.CollOf = CollOf;
  exports.ICheckable = ICheckable;
  exports.IConstrainable = IConstrainable;
  exports.IExplains = IExplains;
  exports.IScope = IScope;
  exports.ISelection = ISelection;
  exports.Isa = Isa;
  exports.Issue = Issue;
  exports.Map = Map;
  exports.Optional = Optional;
  exports.Or = Or;
  exports.Predicate = Predicate;
  exports.Required = Required;
  exports.Scoped = Scoped;
  exports.When = When;
  exports.and = and;
  exports.anno = anno;
  exports.at = at$1;
  exports.atLeast = atLeast;
  exports.atMost = atMost;
  exports.between = between;
  exports.bounds = bounds;
  exports.card = card;
  exports.catches = catches;
  exports.chars = chars;
  exports.check = check$f;
  exports.choice = choice;
  exports.collOf = collOf;
  exports.constrain = constrain;
  exports.constraints = constraints;
  exports.datatype = datatype;
  exports.email = email;
  exports.exactly = exactly;
  exports.explain = explain$1;
  exports.isa = isa;
  exports.issue = issue;
  exports.issues = issues;
  exports.issuing = issuing;
  exports.keyed = keyed;
  exports.map = map;
  exports.opt = opt;
  exports.optional = optional;
  exports.options = options$2;
  exports.or = or;
  exports.parses = parses;
  exports.phone = phone;
  exports.pred = pred;
  exports.present = present;
  exports.range = range;
  exports.req = req;
  exports.required = required;
  exports.scope = scope$1;
  exports.scoped = scoped;
  exports.stateCode = stateCode;
  exports.supplied = supplied;
  exports.toPred = toPred;
  exports.unlimited = unlimited;
  exports.when = when;
  exports.zipCode = zipCode;

  Object.defineProperty(exports, '__esModule', { value: true });

});
