define(['exports', 'atomic/core', 'atomic/reactives', 'atomic/transients', 'dom', 'promise'], function (exports, _, $, mut, dom, Promise$1) { 'use strict';

  var IContent = _.protocol({
    contents: null
  });

  function contents2(self, type) {
    return _.filter(function (node) {
      return node.nodeType === type;
    }, IContent.contents(self));
  }

  var contents$2 = _.overload(null, IContent.contents, contents2);

  var IHideable = _.protocol({
    hide: null,
    show: null,
    toggle: null
  });

  var hide$1 = IHideable.hide;
  var show$1 = IHideable.show;
  var toggle$1 = IHideable.toggle;

  var IHtml = _.protocol({
    html: null
  });

  var html$1 = IHtml.html;

  var IEmbeddable = _.protocol({
    embeddables: null
  });

  var embeddables$2 = IEmbeddable.embeddables;

  function embed3(add, parent, children) {
    var _ref, _ref2, _children, _embeddables, _$mapcat, _ref3, _parent$ownerDocument, _embeddables2, _param, _$each, _ref4;

    _ref = (_ref2 = (_children = children, _.flatten(_children)), (_ref3 = _, _$mapcat = _ref3.mapcat, _embeddables = (_embeddables2 = embeddables$2, _parent$ownerDocument = parent.ownerDocument, function embeddables(_argPlaceholder2) {
      return _embeddables2(_argPlaceholder2, _parent$ownerDocument);
    }), function mapcat(_argPlaceholder) {
      return _$mapcat.call(_ref3, _embeddables, _argPlaceholder);
    })(_ref2)), (_ref4 = _, _$each = _ref4.each, _param = function _param(child) {
      _.isFunction(child) ? child(parent, add) : add(parent, child);
    }, function each(_argPlaceholder3) {
      return _$each.call(_ref4, _param, _argPlaceholder3);
    })(_ref);
  }

  function embed2(parent, children) {
    embed3(function (parent, child) {
      parent.appendChild(child);
    }, parent, children);
  }

  var embed = _.overload(null, null, embed2, embed3);

  var IMountable = _.protocol({});

  var _IMountable, _$satisfies, _ref$2;
  var isMountable = (_ref$2 = _, _$satisfies = _ref$2.satisfies, _IMountable = IMountable, function satisfies(_argPlaceholder) {
    return _$satisfies.call(_ref$2, _IMountable, _argPlaceholder);
  });
  function mounts(self) {
    _.specify(IMountable, {}, self);

    var parent = _.parent(self);

    if (parent) {
      _.each(function (key) {
        $.trigger(self, key, {
          bubbles: true,
          detail: {
            parent: parent
          }
        });
      }, ["mounting", "mounted"]); //ensure hooks trigger even if already mounted

    }

    return self;
  }

  function sel1$2(self, selector) {
    return _.first(ISelectable.sel(self, selector));
  }

  var ISelectable = _.protocol({
    sel: null,
    sel1: sel1$2
  });

  var sel02 = _.pre(function sel02(selector, context) {
    return ISelectable.sel(context, selector);
  }, _.isString);

  function sel01(selector) {
    return sel02(selector, document);
  }

  var sel$2 = _.overload(null, sel01, sel02);

  var sel12 = _.pre(function sel12(selector, context) {
    return ISelectable.sel1(context, selector);
  }, _.isString);

  function sel11(selector) {
    return sel12(selector, document);
  }

  var sel1$1 = _.overload(null, sel11, sel12);

  var IText = _.protocol({
    text: null
  });

  var text$2 = IText.text;

  var IValue = _.protocol({
    value: null
  });

  var value$2 = IValue.value;

  function isHTMLDocument(self) {
    return self instanceof dom.HTMLDocument;
  }

  var element = _.assume(isHTMLDocument, dom.document, _.curry(function element(document, name) {
    var _contents, _embed;

    for (var _len = arguments.length, contents = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      contents[_key - 2] = arguments[_key];
    }

    return _.doto(document.createElement(name), (_embed = embed, _contents = contents, function embed(_argPlaceholder) {
      return _embed(_argPlaceholder, _contents);
    }));
  }, 2));
  var elementns = _.assume(isHTMLDocument, dom.document, _.curry(function elementns(document, ns, name) {
    var _contents2, _embed2;

    for (var _len2 = arguments.length, contents = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      contents[_key2 - 3] = arguments[_key2];
    }

    return _.doto(document.createElementNS(ns, name), (_embed2 = embed, _contents2 = contents, function embed(_argPlaceholder2) {
      return _embed2(_argPlaceholder2, _contents2);
    }));
  }, 3));
  function isElement(self) {
    return self instanceof dom.Element;
  }

  function InvalidHostElementError(el, selector) {
    this.el = el;
    this.selector = selector;
  }

  function toString() {
    return "Element \"".concat(this.el.tagName, "\" failed to match \"").concat(this.selector, "\".");
  }

  InvalidHostElementError.prototype = Object.assign(new Error(), {
    toString: toString
  });

  function Attrs(node) {
    this.node = node;
  }
  function attrs(node) {
    return new Attrs(node);
  }

  function toArray(self) {
    return _.toArray(next2(self, 0));
  }

  function count$2(self) {
    return self.node.attributes.length;
  }

  function lookup$4(self, key) {
    return self.node.getAttribute(key);
  }

  function assoc$3(self, key, value) {
    self.node.setAttribute(key, value);
  }

  function dissoc$3(self, key) {
    self.node.removeAttribute(key);
  }

  function seq$2(self) {
    return count$2(self) ? self : null;
  }

  function first$1(self) {
    return count$2(self) ? [self.node.attributes[0].name, self.node.attributes[0].value] : null;
  }

  function rest$1(self) {
    return next$1(self) || _.emptyList();
  }

  function next2(self, idx) {
    return idx < count$2(self) ? _.lazySeq(function () {
      return _.cons([self.node.attributes[idx].name, self.node.attributes[idx].value], next2(self, idx + 1));
    }) : null;
  }

  function next$1(self) {
    return next2(self, 1);
  }

  function keys$2(self) {
    return _.map(_.first, next2(self, 0));
  }

  function vals$2(self) {
    return _.map(_.second, next2(self, 0));
  }

  function contains$3(self, key) {
    return self.node.hasAttribute(key);
  }

  function includes$4(self, pair) {
    return lookup$4(self, _.key(pair)) == _.val(pair);
  }

  function empty$1(self) {
    while (self.node.attributes.length > 0) {
      self.node.removeAttribute(self.node.attributes[0].name);
    }
  }

  var behave$c = _.does(_.implement(_.ICoercible, {
    toArray: toArray
  }), _.implement(_.ICounted, {
    count: count$2
  }), _.implement(_.ISeqable, {
    seq: seq$2
  }), _.implement(_.INext, {
    next: next$1
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }), _.implement(_.IMap, {
    keys: keys$2,
    vals: vals$2
  }), _.implement(_.IInclusive, {
    includes: includes$4
  }), _.implement(_.IAssociative, {
    contains: contains$3
  }), _.implement(_.ILookup, {
    lookup: lookup$4
  }), _.implement(mut.ITransientMap, {
    dissoc: dissoc$3
  }), _.implement(mut.ITransientEmptyableCollection, {
    empty: empty$1
  }), _.implement(mut.ITransientAssociative, {
    assoc: assoc$3
  }));

  behave$c(Attrs);

  function embeddables$1(self) {
    return [self];
  }

  var behave$b = _.does(_.implement(IEmbeddable, {
    embeddables: embeddables$1
  }));

  var behaviors = {};

  Object.assign(behaviors, {
    Comment: behave$b
  });
  behave$b(dom.Comment);

  function send2(self, message) {
    send3(self, message, "log");
  }

  function send3(self, message, address) {
    self[address](message);
  }

  var send = _.overload(null, null, send2, send3);

  var behave$a = _.does(_.specify(_.ISend, {
    send: send
  }));

  behave$a(console);

  var fragment = _.assume(isHTMLDocument, dom.document, function fragment(document) {
    var _contents, _embed;

    for (var _len = arguments.length, contents = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      contents[_key - 1] = arguments[_key];
    }

    return _.doto(document.createDocumentFragment(), (_embed = embed, _contents = contents, function embed(_argPlaceholder) {
      return _embed(_argPlaceholder, _contents);
    }));
  });
  function isDocumentFragment(self) {
    return self && self instanceof dom.DocumentFragment;
  }

  function NestedAttrs(element, key) {
    this.element = element;
    this.key = key;
  }

  function nestedAttrs2(element, key) {
    return new NestedAttrs(element, key);
  }

  function nestedAttrs1(key) {
    return function (element) {
      return nestedAttrs2(element, key);
    };
  }

  var nestedAttrs = _.overload(null, nestedAttrs1, nestedAttrs2);
  var style = nestedAttrs1("style");

  var _hides, _$includes, _ref$1, _nestedAttrs;
  var hides = ["display", "none"];
  var hidden = _.comp((_ref$1 = _, _$includes = _ref$1.includes, _hides = hides, function includes(_argPlaceholder) {
    return _$includes.call(_ref$1, _argPlaceholder, _hides);
  }), (_nestedAttrs = nestedAttrs, function nestedAttrs(_argPlaceholder2) {
    return _nestedAttrs(_argPlaceholder2, "style");
  }));

  var toggle = _.partial(_.toggles, show, hide, hidden);

  function hide(self) {
    mut.conj(nestedAttrs(self, "style"), hides);
  }

  function show(self) {
    mut.omit(nestedAttrs(self, "style"), hides); //TODO mut unconj
  }

  function embeddables(self) {
    function embed(parent, add) {
      if (isMountable(self)) {
        var detail = {
          parent: parent
        };
        $.trigger(self, "mounting", {
          bubbles: true,
          detail: detail
        });
        add(parent, self);
        $.trigger(self, "mounted", {
          bubbles: true,
          detail: detail
        });
      } else {
        add(parent, self);
      }
    }

    return [embed];
  }

  function append(self, content) {
    embed(self, [content]);
  }

  function prepend(self, content) {
    embed(function (parent, child) {
      parent.insertBefore(child, parent.childNodes[0]);
    }, self, [content]);
  }

  function before(self, content) {
    embed(function (parent, child) {
      parent.insertBefore(child, self);
    }, _.parent(self), [content]);
  }

  function after(self, content) {
    var ref = _.nextSibling(self);

    embed(function (parent, child) {
      parent.insertBefore(child, ref);
    }, _.parent(self), [content]);
  }

  var conj$4 = append;

  function check(self, selector) {
    return _.isString(selector);
  }

  var matches$1 = _.pre(function matches(self, selector) {
    return self.matches(selector);
  }, check);

  function isAttrs(self) {
    return !(self instanceof Node) && _.descriptive(self);
  }

  function eventContext(catalog) {
    function on3(self, key, callback) {
      _.isString(key) ? _.each(function (key) {
        self.addEventListener(key, callback);
      }, _.compact(key.split(" "))) : self.addEventListener(key, callback);
      return self;
    }

    function on4(self, key, selector, callback) {
      var _catalog, _callback, _$assoc, _ref2;

      on3(self, key, _.doto(function (e) {
        if (_.matches(e.target, selector)) {
          callback.call(e.target, e);
        } else {
          var found = _.closest(e.target, selector);

          if (found && self.contains(found)) {
            callback.call(found, e);
          }
        }
      }, (_ref2 = _, _$assoc = _ref2.assoc, _catalog = catalog, _callback = callback, function assoc(_argPlaceholder3) {
        return _$assoc.call(_ref2, _catalog, _callback, _argPlaceholder3);
      })));
      return self;
    }

    var on = _.overload(null, null, null, on3, on4);

    function off(self, key, callback) {
      self.removeEventListener(key, _.get(catalog, callback, callback));
      return self;
    }

    return {
      on: on,
      off: off
    };
  }

  var _eventContext = eventContext(_.weakMap()),
      on$1 = _eventContext.on,
      off = _eventContext.off;

  var eventConstructors = {
    "click": MouseEvent,
    "mousedown": MouseEvent,
    "mouseup": MouseEvent,
    "mouseover": MouseEvent,
    "mousemove": MouseEvent,
    "mouseout": MouseEvent,
    "focus": FocusEvent,
    "blur": FocusEvent
  };
  var eventDefaults = {
    bubbles: true
  };

  function trigger(self, key, options) {
    options = Object.assign({}, eventDefaults, options || {});
    var Event = eventConstructors[key] || CustomEvent;
    var event = null;

    try {
      event = new Event(key, options);
    } catch (ex) {
      event = self.ownerDocument.createEvent('HTMLEvents');
      event.initEvent(key, options.bubbles || false, options.cancelable || false);
      event.detail = options.detail;
    }

    self.dispatchEvent(event);
    return self;
  }

  function contents$1(self) {
    return self.contentDocument || _.seq(self.childNodes);
  }

  function assoc$2(self, key, value) {
    self.setAttribute(key, _.str(value));
  }

  function dissoc$2(self, key) {
    self.removeAttribute(key);
  }

  function keys2(self, idx) {
    return idx < self.attributes.length ? _.lazySeq(function () {
      return _.cons(self.attributes[idx].name, keys2(self, idx + 1));
    }) : _.emptyList();
  }

  function keys$1(self) {
    return keys2(self, 0);
  }

  function vals2(self, idx) {
    return idx < self.attributes.length ? _.lazySeq(function () {
      return _.cons(self.attributes[idx].value, keys2(self, idx + 1));
    }) : _.emptyList();
  }

  function vals$1(self) {
    return vals2(self, 0);
  }

  function lookup$3(self, key) {
    return self.getAttribute(key);
  }

  function contains$2(self, key) {
    return self.hasAttribute(key);
  }

  function parent$1(self) {
    return self && self.parentNode;
  }

  var parents$1 = _.upward(function (self) {
    return self && self.parentElement;
  });

  var root = _.comp(_.last, _.upward(parent$1));

  function closest$1(self, selector) {
    var target = self;

    while (target) {
      if (_.matches(target, selector)) {
        return target;
      }

      target = _.parent(target);
    }
  }

  function sel$1(self, selector) {
    return self.querySelectorAll(selector);
  }

  function sel1(self, selector) {
    return self.querySelector(selector);
  }

  function children$1(self) {
    return _.seq(self.children || _.filter(isElement, self.childNodes)); //IE has no children on document fragment
  }

  var descendants$1 = _.downward(_.children);

  function nextSibling$1(self) {
    return self.nextElementSibling;
  }

  var nextSiblings$1 = _.upward(_.nextSibling);

  function prevSibling$1(self) {
    return self.previousElementSibling;
  }

  var prevSiblings$1 = _.upward(_.prevSibling);

  function siblings$1(self) {
    return _.concat(prevSiblings$1(self), nextSiblings$1(self));
  }

  function omit1(self) {
    omit2(parent$1(self), self);
  }

  function omit2(self, node) {
    if (isElement(node)) {
      self.removeChild(node);
    } else if (_.satisfies(_.ISequential, node)) {
      var _keys = node;

      _.each(self.removeAttribute.bind(self), _keys);
    } else if (isAttrs(node)) {
      var attrs = node;

      _.each(function (entry) {
        var key = entry[0],
            value = entry[1];
        var curr = lookup$3(self, key);

        if (_.isObject(curr)) {
          curr = mapa(function (pair) {
            return pair.join(": ") + "; ";
          }, _.toArray(curr)).join("").trim();
        }

        curr == value && dissoc$2(self, key);
      }, attrs);
    } else if (_.isString(node)) {
      node = includes$3(self, node);
      self.removeChild(node);
    }
  }

  var omit$3 = _.overload(null, omit1, omit2); //TODO too overloaded, impure protocol

  function includes$3(self, target) {
    if (isElement(target)) {
      var _target, _$isIdentical, _ref3;

      return _.detect((_ref3 = _, _$isIdentical = _ref3.isIdentical, _target = target, function isIdentical(_argPlaceholder4) {
        return _$isIdentical.call(_ref3, _target, _argPlaceholder4);
      }), children$1(self));
    } else if (_.satisfies(_.ISequential, target)) {
      var _keys2 = target;
      return _.reduce(function (memo, key) {
        return memo ? self.hasAttribute(key) : reduced(memo);
      }, true, _keys2);
    } else if (isAttrs(target)) {
      return _.reducekv(function (memo, key, value) {
        return memo ? lookup$3(self, key) == value : reduced(memo);
      }, true, target);
    } else {
      return _.detect(_.isString(target) ? function (node) {
        return node.nodeType === Node.TEXT_NODE && node.data === target;
      } : function (node) {
        return node === target;
      }, contents$1(self));
    }
  }

  function empty(self) {
    while (self.firstChild) {
      self.removeChild(self.firstChild);
    }
  }

  function clone(self) {
    return self.cloneNode(true);
  }

  function value1(self) {
    switch (self.getAttribute("type")) {
      case "checkbox":
        return self.checked;

      case "number":
      case "range":
        return _.maybe(self.value, _.blot, parseFloat);

      default:
        return "value" in self ? self.value : null;
    }
  }

  function value2(self, value) {
    switch (self.getAttribute("type")) {
      case "checkbox":
        self.checked = !!value;
        return;

      case "number":
      case "range":
        self.value = _.maybe(value, _.blot, parseFloat);
        return;

      default:
        if ("value" in self) {
          value = value == null ? "" : value;

          if (self.value != value) {
            self.value = value;
          }
        } else {
          throw new TypeError("Type does not support value property.");
        }

    }
  }

  var value$1 = _.overload(null, value1, value2);

  function text1(self) {
    return self.textContent;
  }

  function text2(self, text) {
    self.textContent = text == null ? "" : text;
  }

  var text$1 = _.overload(null, text1, text2);

  function html1(self) {
    return self.innerHTML;
  }

  function html2(self, html) {
    if (_.isString(html)) {
      self.innerHTML = html;
    } else {
      empty(self);
      embed(self, [html]);
    }

    return self;
  }

  var html = _.overload(null, html1, html2);

  function reduce$1(self, f, init) {
    return _.reduce(f, init, _.descendants(self));
  }

  var ihierarchy = _.implement(_.IHierarchy, {
    root: root,
    parent: parent$1,
    parents: parents$1,
    closest: closest$1,
    children: children$1,
    descendants: descendants$1,
    nextSibling: nextSibling$1,
    nextSiblings: nextSiblings$1,
    prevSibling: prevSibling$1,
    prevSiblings: prevSiblings$1,
    siblings: siblings$1
  });
  var icontents = _.implement(IContent, {
    contents: contents$1
  });
  var ievented = _.implement($.IEvented, {
    on: on$1,
    off: off,
    trigger: trigger
  });
  var iselectable = _.implement(ISelectable, {
    sel: sel$1,
    sel1: sel1
  });
  var ielement = _.does(ihierarchy, icontents, ievented, iselectable, _.implement(_.IReduce, {
    reduce: reduce$1
  }), _.implement(IValue, {
    value: value$1
  }), _.implement(IText, {
    text: text$1
  }), _.implement(IHtml, {
    html: html
  }), _.implement(IEmbeddable, {
    embeddables: embeddables
  }), _.implement(mut.ITransientEmptyableCollection, {
    empty: empty
  }), _.implement(mut.ITransientInsertable, {
    before: before,
    after: after
  }), _.implement(_.IInclusive, {
    includes: includes$3
  }), _.implement(IHideable, {
    show: show,
    hide: hide,
    toggle: toggle
  }), _.implement(mut.ITransientOmissible, {
    omit: omit$3
  }), _.implement(_.IMatchable, {
    matches: matches$1
  }), _.implement(_.IClonable, {
    clone: clone
  }), _.implement(mut.ITransientAppendable, {
    append: append
  }), _.implement(mut.ITransientPrependable, {
    prepend: prepend
  }), _.implement(mut.ITransientCollection, {
    conj: conj$4
  }), _.implement(_.ILookup, {
    lookup: lookup$3
  }), _.implement(_.IMap, {
    keys: keys$1,
    vals: vals$1
  }), _.implement(mut.ITransientMap, {
    dissoc: dissoc$2
  }), _.implement(_.IAssociative, {
    contains: contains$2
  }), _.implement(mut.ITransientAssociative, {
    assoc: assoc$2
  }));

  var behave$9 = _.does(ielement, _.implement(_.IHierarchy, {
    nextSibling: _.constantly(null),
    nextSiblings: _.emptyList,
    prevSibling: _.constantly(null),
    prevSiblings: _.emptyList,
    siblings: _.emptyList,
    parent: _.constantly(null),
    parents: _.emptyList
  }), _.implement(_.INext, {
    next: _.constantly(null)
  }), _.implement(_.ISeq, {
    first: _.identity,
    rest: _.emptyList
  }), _.implement(_.ISeqable, {
    seq: _.cons
  }));

  Object.assign(behaviors, {
    DocumentFragment: behave$9
  });
  behave$9(dom.DocumentFragment);

  function replaceWith(self, other) {
    var parent = _.parent(self),
        replacement = _.isString(other) ? self.ownerDocument.createTextNode(other) : other;

    parent.replaceChild(replacement, self);
  }
  function wrap(self, other) {
    replaceWith(self, other);
    mut.append(other, self);
  }
  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }
  function enable(self, enabled) {
    self.disabled = !enabled;
    return self;
  }

  Object.assign(behaviors, {
    Window: ielement,
    Element: ielement,
    Text: ielement
  });
  ielement(dom.Window);
  ielement(dom.Element);
  ielement(dom.Text);

  function seq2(self, idx) {
    return idx < self.length ? _.lazySeq(function () {
      return _.cons(self.item(idx), seq2(self, idx + 1));
    }) : null;
  }

  function seq$1(self) {
    return seq2(self, 0);
  }

  function lookup$2(self, idx) {
    return self[idx];
  }

  var first = _.comp(_.first, seq$1);

  var rest = _.comp(_.rest, seq$1);

  var next = _.comp(_.next, seq$1);

  var children = _.comp(_.children, seq$1);

  var descendants = _.comp(_.descendants, seq$1);

  var nextSibling = _.comp(_.nextSibling, seq$1);

  var nextSiblings = _.comp(_.nextSiblings, seq$1);

  var prevSibling = _.comp(_.prevSibling, seq$1);

  var prevSiblings = _.comp(_.prevSiblings, seq$1);

  var siblings = _.comp(_.siblings, seq$1);

  var parent = _.comp(_.parent, seq$1);

  var parents = _.comp(_.parents, seq$1);

  var contents = _.comp(_.contents, seq$1);

  function sel(self, selector) {
    var _$matches, _$filter, _ref, _selector, _$matches2, _ref2;

    return _.maybe(self, seq$1, (_ref = _, _$filter = _ref.filter, _$matches = (_ref2 = _, _$matches2 = _ref2.matches, _selector = selector, function matches(_argPlaceholder2) {
      return _$matches2.call(_ref2, _argPlaceholder2, _selector);
    }), function filter(_argPlaceholder) {
      return _$filter.call(_ref, _$matches, _argPlaceholder);
    }));
  }

  function closest(self, selector) {
    var _selector2, _$closest, _ref3;

    return _.maybe(self, seq$1, (_ref3 = _, _$closest = _ref3.closest, _selector2 = selector, function closest(_argPlaceholder3) {
      return _$closest.call(_ref3, _argPlaceholder3, _selector2);
    }));
  }

  function reduce(self, f, init) {
    return _.reduce(f, init, seq$1(self));
  }

  function count$1(self) {
    return self.length;
  }

  var behave$8 = _.does(_.iterable, _.implement(_.ILookup, {
    lookup: lookup$2
  }), _.implement(_.IIndexed, {
    nth: lookup$2
  }), _.implement(_.ICounted, {
    count: count$1
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.ICoercible, {
    toArray: Array.from
  }), _.implement(_.IHierarchy, {
    parent: parent,
    parents: parents,
    closest: closest,
    nextSiblings: nextSiblings,
    nextSibling: nextSibling,
    prevSiblings: prevSiblings,
    prevSibling: prevSibling,
    siblings: siblings,
    children: children,
    descendants: descendants
  }), _.implement(_.ISequential), _.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(IContent, {
    contents: contents
  }), _.implement(ISelectable, {
    sel: sel
  }));

  Object.assign(behaviors, {
    HTMLCollection: behave$8
  });
  behave$8(dom.HTMLCollection);

  var behave$7 = _.does(ielement, _.implement(_.IMatchable, {
    matches: _.constantly(false)
  }), _.implement(_.IHierarchy, {
    closest: _.constantly(null),
    nextSibling: _.constantly(null),
    nextSiblings: _.emptyList,
    prevSibling: _.constantly(null),
    prevSiblings: _.emptyList,
    siblings: _.emptyList,
    parent: _.constantly(null),
    parents: _.emptyList
  }));

  Object.assign(behaviors, {
    HTMLDocument: behave$7
  });
  behave$7(dom.HTMLDocument);

  var behave$6 = _.noop;

  Object.assign(behaviors, {
    HTMLInputElement: behave$6
  });
  behave$6(dom.HTMLInputElement);

  var _$either, _ref2;

  function conj$3(self, entry) {
    self.append(isElement(entry) ? entry : element("option", {
      value: _.key(entry)
    }, _.val(entry)));
  }

  function access(f) {
    function value1(self) {
      var _param, _$detect, _ref;

      return _.maybe(sel$2("option", self), (_ref = _, _$detect = _ref.detect, _param = function _param(option) {
        return option.selected;
      }, function detect(_argPlaceholder) {
        return _$detect.call(_ref, _param, _argPlaceholder);
      }), f);
    }

    function value2(self, value) {
      var options = sel$2("option", self);

      var chosen = _.detect(function (option) {
        return f(option) == value;
      }, options);

      if (chosen) {
        _.each(function (option) {
          var selected = f(option) == value;

          if (option.selected != selected) {
            option.selected = selected;
          }
        }, options);
      } else {
        throw new Error("Cannot set value — it is not an option.");
      }
    }

    return _.overload(null, value1, value2);
  }

  var text = _.comp((_ref2 = _, _$either = _ref2.either, function either(_argPlaceholder2) {
    return _$either.call(_ref2, _argPlaceholder2, "");
  }), access(text$2)),
      value = access(value$2);

  var behave$5 = _.does(_.implement(mut.ITransientCollection, {
    conj: conj$3
  }), _.implement(mut.ITransientAppendable, {
    append: conj$3
  }), _.implement(IValue, {
    value: value
  }), _.implement(IText, {
    text: text
  }));

  Object.assign(behaviors, {
    HTMLSelectElement: behave$5
  });
  behave$5(dom.HTMLSelectElement);

  function isLocation(self) {
    return self instanceof dom.Location;
  }

  function matches(self, pattern) {
    if (_.isRegExp(pattern)) {
      return _.test(pattern, decodeURI(self.pathname));
    } else if (_.isString(pattern)) {
      return matches(self, new RegExp(pattern, "i"));
    }
  }

  function on(self, pattern, callback) {
    var matched = matches(self, pattern);

    if (matched) {
      callback(matched);
    }
  }

  var behave$4 = _.does(_.implement($.IEvented, {
    on: on
  }), _.implement(_.IMatchable, {
    matches: matches
  }));

  Object.assign(behaviors, {
    Location: behave$4
  });
  behave$4(dom.Location);

  function asText(obj) {
    return _.mapa(function (entry) {
      var key = entry[0],
          value = entry[1];
      return _.str(key, ": ", value, ";");
    }, _.seq(obj)).join(" ");
  }

  function deref$1(self) {
    var text = self.element.getAttribute(self.key);
    return text == null ? {} : _.reduce(function (memo, pair) {
      return _.conj(memo, pair);
    }, {}, _.mapa(function (text) {
      return _.mapa(_.trim, _.split(text, ":"));
    }, _.compact(_.split(text, ";"))));
  }

  function lookup$1(self, key) {
    return _.get(deref$1(self), key);
  }

  function contains$1(self, key) {
    return _.contains(deref$1(self), key);
  }

  function assoc$1(self, key, value) {
    self.element.setAttribute(self.key, asText(_.assoc(deref$1(self), key, value)));
  }

  function dissoc$1(self, key) {
    self.element.setAttribute(self.key, asText(_.dissoc(deref$1(self), key)));
  }

  function keys(self) {
    return _.keys(deref$1(self));
  }

  function vals(self) {
    return _.vals(deref$1(self));
  }

  function includes$2(self, pair) {
    return _.includes(deref$1(self), pair);
  }

  function omit$2(self, pair) {
    self.element.setAttribute(self.key, asText(_.omit(deref$1(self), pair)));
  }

  function conj$2(self, pair) {
    self.element.setAttribute(self.key, asText(_.conj(deref$1(self), pair)));
  }

  var behave$3 = _.does(_.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(_.IMap, {
    keys: keys,
    vals: vals
  }), _.implement(_.IInclusive, {
    includes: includes$2
  }), _.implement(_.IAssociative, {
    contains: contains$1
  }), _.implement(_.ILookup, {
    lookup: lookup$1
  }), _.implement(_.ICoercible, {
    toObject: deref$1
  }), _.implement(mut.ITransientMap, {
    dissoc: dissoc$1
  }), _.implement(mut.ITransientAssociative, {
    assoc: assoc$1
  }), _.implement(mut.ITransientOmissible, {
    omit: omit$2
  }), _.implement(mut.ITransientCollection, {
    conj: conj$2
  }));

  behave$3(NestedAttrs);

  function isNodeList(self) {
    return self.constructor === dom.NodeList;
  }

  Object.assign(behaviors, {
    NodeList: behave$8
  });
  behave$8(dom.NodeList);

  function Props(node) {
    this.node = node;
  }
  function props(node) {
    return new Props(node);
  }

  function lookup(self, key) {
    return self.node[key];
  }

  function contains(self, key) {
    return self.node.hasOwnProperty(key);
  }

  function assoc(self, key, value) {
    self.node[key] = value;
  }

  function dissoc(self, key) {
    delete self.node[key];
  }

  function includes$1(self, entry) {
    return self.node[_.key(entry)] === _.val(entry);
  }

  function omit$1(self, entry) {
    includes$1(self, entry) && _dissoc(self, _.key(entry));
  }

  function conj$1(self, entry) {
    assoc(self, _.key(entry), _.val(entry));
  }

  var behave$2 = _.does(_.implement(_.IMap, {
    keys: Object.keys,
    vals: Object.values
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(_.IAssociative, {
    contains: contains
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(mut.ITransientAssociative, {
    assoc: assoc
  }), _.implement(mut.ITransientMap, {
    dissoc: dissoc
  }), _.implement(mut.ITransientOmissible, {
    omit: omit$1
  }), _.implement(mut.ITransientCollection, {
    conj: conj$1
  }));

  behave$2(Props);

  function SpaceSeparated(element, key) {
    this.element = element;
    this.key = key;
  }

  function spaceSep2(element, key) {
    return new SpaceSeparated(element, key);
  }

  function spaceSep1(key) {
    return function (element) {
      return spaceSep2(element, key);
    };
  }

  var spaceSep = _.overload(null, spaceSep1, spaceSep2);
  var classes = spaceSep1("class");

  function seq(self) {
    var text = self.element.getAttribute(self.key);
    return text && text.length ? text.split(" ") : null;
  }

  function includes(self, text) {
    var xs = seq(self);
    return xs && _.filter(function (t) {
      return t == text;
    }, xs);
  }

  function conj(self, text) {
    self.element.setAttribute(self.key, deref(self).concat(text).join(" "));
  }

  function omit(self, text) {
    self.element.setAttribute(self.key, _.filtera(function (t) {
      return t !== text;
    }, seq(self)).join(" "));
  }

  function deref(self) {
    return seq(self) || [];
  }

  function count(self) {
    return deref(self).length;
  }

  var behave$1 = _.does(_.implement(_.ISequential), _.implement(_.ISeq, {
    seq: seq
  }), _.implement(_.IDeref, {
    deref: deref
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.ICoercible, {
    toArray: deref
  }), _.implement(_.ICounted, {
    count: count
  }), _.implement(mut.ITransientOmissible, {
    omit: omit
  }), _.implement(mut.ITransientCollection, {
    conj: conj
  }));

  behave$1(SpaceSeparated);

  function isXMLDocument(self) {
    return self instanceof dom.XMLDocument;
  }

  Object.assign(behaviors, {
    XMLDocument: behave$7
  });
  behave$7(dom.XMLDocument);

  var _behaviors, _$behaves, _ref;
  var behave = (_ref = _, _$behaves = _ref.behaves, _behaviors = behaviors, function behaves(_argPlaceholder) {
    return _$behaves.call(_ref, _behaviors, _argPlaceholder);
  });
  var ready = _.assume(isHTMLDocument, dom.document, function ready(document, callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  });

  function attr2(self, key) {
    if (_.isString(key)) {
      return self.getAttribute(key);
    } else {
      var _self, _attr;

      var pairs = key;

      _.eachkv((_attr = attr3, _self = self, function attr3(_argPlaceholder2, _argPlaceholder3) {
        return _attr(_self, _argPlaceholder2, _argPlaceholder3);
      }), pairs);
    }
  }

  function attr3(self, key, value) {
    self.setAttribute(key, _.str(value));
  }

  function attrN(self) {
    var stop = (arguments.length <= 1 ? 0 : arguments.length - 1) - 1;

    for (var i = 0; i <= stop; i += 2) {
      attr3(self, i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1], i + 1 + 1 < 1 || arguments.length <= i + 1 + 1 ? undefined : arguments[i + 1 + 1]);
    }
  }

  var attr = _.overload(null, null, attr2, attr3, attrN);

  function removeAttr2(self, key) {
    self.removeAttribute(key);
  }

  var removeAttr = _.overload(null, null, removeAttr2, _.doing(removeAttr2));

  function prop3(self, key, value) {
    self[key] = value;
  }

  function prop2(self, key) {
    return self[key];
  }

  var prop = _.overload(null, null, prop2, prop3);
  function addStyle(self, key, value) {
    self.style[key] = value;
  }

  function removeStyle2(self, key) {
    self.style.removeProperty(key);
  }

  function removeStyle3(self, key, value) {
    if (self.style[key] === value) {
      self.style.removeProperty(key);
    }
  }

  var removeStyle = _.overload(null, null, removeStyle2, removeStyle3);
  function addClass(self, name) {
    self.classList.add(name);
  }
  function removeClass(self, name) {
    self.classList.remove(name);
  }

  function toggleClass2(self, name) {
    toggleClass3(self, name, !self.classList.contains(name));
  }

  function toggleClass3(self, name, want) {
    self.classList[want ? "add" : "remove"](name);
  }

  var toggleClass = _.overload(null, null, toggleClass2, toggleClass3);
  function hasClass(self, name) {
    return self.classList.contains(name);
  }
  function assert(el, selector) {
    if (!_.matches(el, selector)) {
      throw new InvalidHostElementError(el, selector);
    }
  }

  function mount3(render, config, el) {
    return mount4(_.constantly(null), render, config, el);
  }

  function mount4(create, render, config, el) {
    var _el, _param, _$$on, _$, _el2, _config, _bus, _render, _el3;

    config.what && $.trigger(el, config.what + ":installing", {
      bubbles: true,
      detail: {
        config: config
      }
    });
    $.trigger(el, "installing", {
      bubbles: true,
      detail: {
        config: config
      }
    });
    var bus = create(config),
        detail = {
      config: config,
      bus: bus
    };
    _el = el, (_$ = $, _$$on = _$.on, _param = function _param(e) {
      Object.assign(e.detail, detail);
    }, function on(_argPlaceholder4) {
      return _$$on.call(_$, _argPlaceholder4, "mounting mounted", _param);
    })(_el);
    _el2 = el, (_render = render, _config = config, _bus = bus, function render(_argPlaceholder5) {
      return _render(_argPlaceholder5, _config, _bus);
    })(_el2);
    _el3 = el, mounts(_el3);
    config.what && $.trigger(el, config.what + ":installed", {
      bubbles: true,
      detail: detail
    });
    $.trigger(el, "installed", {
      bubbles: true,
      detail: detail
    });
    return bus;
  }

  var mount = _.overload(null, null, null, mount3, mount4);
  var markup = _.obj(function (name) {
    for (var _len = arguments.length, contents = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      contents[_key - 1] = arguments[_key];
    }

    var attrs = _.map(function (entry) {
      return _.template("{0}=\"{1}\"", _.key(entry), _.replace(_.val(entry), /"/g, '&quot;'));
    }, _.apply(_.merge, _.filter(_.isObject, contents)));

    var content = _.map(_.str, _.remove(_.isObject, contents));

    return _.join("", _.concat(["<" + name + " " + _.join(" ", attrs) + ">"], content, "</" + name + ">"));
  }, Infinity);

  function tags0() {
    return tags1(element(dom.document));
  }

  var tags1 = _.factory;

  function tags2(engine, keys) {
    return tags3(engine, _.identity, keys);
  }

  function tags3(engine, f, keys) {
    var tag = tags1(engine);
    return _.reduce(function (memo, key) {
      memo[key] = f(tag(key));
      return memo;
    }, {}, keys);
  }

  var tags = _.overload(tags0, tags1, tags2, tags3);
  var tag = tags();
  var option = _.assume(isHTMLDocument, dom.document, _.overload(null, null, function option(document, entry) {
    return element(document, "option", {
      value: _.key(entry)
    }, _.val(entry));
  }, function (document, key, value) {
    return element(document, "option", {
      value: key
    }, value);
  }));
  var select = _.called(_.assume(isHTMLDocument, dom.document, function select(document, entries) {
    var _document, _option;

    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    return element.apply(void 0, [document, "select", _.map((_option = option, _document = document, function option(_argPlaceholder6) {
      return _option(_document, _argPlaceholder6);
    }), entries)].concat(args));
  }), "`select` is deprecated — use `select` tag with `option(key, value),...` or `map(option, entries)`.");
  var checkbox = _.called(_.assume(isHTMLDocument, dom.document, function checkbox(document) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    var el = element.apply(void 0, [document, 'input', {
      type: "checkbox"
    }].concat(args));

    function value1(el) {
      return el.checked;
    }

    function value2(el, checked) {
      el.checked = checked;
    }

    var value = _.overload(null, value1, value2);

    return _.doto(el, _.specify(IValue, {
      value: value
    }));
  }), "`checkbox` is deprecated — use `input` tag with {type: 'checkbox'} instead.");
  var input = _.called(_.assume(isHTMLDocument, dom.document, function input(document) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    return element.apply(void 0, [document, 'input', {
      type: "text"
    }].concat(args));
  }), "`input` is deprecated — use `input` tag with {type: 'text'}.");
  var textbox = input;

  _.extend(_.ICoercible, {
    toFragment: null
  });

  var toFragment = _.toFragment;

  (function () {
    function embeddables(self, doc) {
      return [(doc || dom.document).createTextNode(self)];
    }

    function toFragment(self, doc) {
      return (doc || dom.document).createRange().createContextualFragment(self);
    }

    _.doto(String, _.implement(_.ICoercible, {
      toFragment: toFragment
    }), _.implement(IEmbeddable, {
      embeddables: embeddables
    }));
  })();

  (function () {
    function embeddables(self, doc) {
      return [(doc || dom.document).createTextNode(self)];
    }

    _.doto(Number, _.implement(IEmbeddable, {
      embeddables: embeddables
    }));
  })();

  (function () {
    function embeddables(self, doc) {
      function embed(el) {
        _.each(function (entry) {
          mut.assoc(el, _.key(entry), _.val(entry)); //attributes
        }, self);
      }

      return [embed];
    }

    _.doto(Object, _.implement(IEmbeddable, {
      embeddables: embeddables
    }));
  })();

  (function () {
    function toFragment(self, doc) {
      return (doc || dom.document).createRange().createContextualFragment("");
    }

    _.doto(_.Nil, _.implement(_.ICoercible, {
      toFragment: toFragment
    }), _.implement(IEmbeddable, {
      embeddables: _.emptyList
    }));
  })();

  Object.defineProperty(exports, 'after', {
    enumerable: true,
    get: function () {
      return mut.after;
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function () {
      return mut.append;
    }
  });
  Object.defineProperty(exports, 'before', {
    enumerable: true,
    get: function () {
      return mut.before;
    }
  });
  Object.defineProperty(exports, 'empty', {
    enumerable: true,
    get: function () {
      return mut.empty;
    }
  });
  Object.defineProperty(exports, 'omit', {
    enumerable: true,
    get: function () {
      return mut.omit;
    }
  });
  Object.defineProperty(exports, 'prepend', {
    enumerable: true,
    get: function () {
      return mut.prepend;
    }
  });
  exports.Attrs = Attrs;
  exports.IContent = IContent;
  exports.IEmbeddable = IEmbeddable;
  exports.IHideable = IHideable;
  exports.IHtml = IHtml;
  exports.IMountable = IMountable;
  exports.ISelectable = ISelectable;
  exports.IText = IText;
  exports.IValue = IValue;
  exports.InvalidHostElementError = InvalidHostElementError;
  exports.NestedAttrs = NestedAttrs;
  exports.Props = Props;
  exports.SpaceSeparated = SpaceSeparated;
  exports.addClass = addClass;
  exports.addStyle = addStyle;
  exports.assert = assert;
  exports.attr = attr;
  exports.attrs = attrs;
  exports.behave = behave;
  exports.behaviors = behaviors;
  exports.checkbox = checkbox;
  exports.classes = classes;
  exports.contents = contents$2;
  exports.element = element;
  exports.elementns = elementns;
  exports.embed = embed;
  exports.embeddables = embeddables$2;
  exports.enable = enable;
  exports.fragment = fragment;
  exports.hasClass = hasClass;
  exports.hide = hide$1;
  exports.html = html$1;
  exports.input = input;
  exports.isDocumentFragment = isDocumentFragment;
  exports.isElement = isElement;
  exports.isHTMLDocument = isHTMLDocument;
  exports.isLocation = isLocation;
  exports.isMountable = isMountable;
  exports.isNodeList = isNodeList;
  exports.isVisible = isVisible;
  exports.isXMLDocument = isXMLDocument;
  exports.markup = markup;
  exports.mount = mount;
  exports.mounts = mounts;
  exports.nestedAttrs = nestedAttrs;
  exports.option = option;
  exports.prop = prop;
  exports.props = props;
  exports.ready = ready;
  exports.removeAttr = removeAttr;
  exports.removeClass = removeClass;
  exports.removeStyle = removeStyle;
  exports.replaceWith = replaceWith;
  exports.sel = sel$2;
  exports.sel1 = sel1$1;
  exports.select = select;
  exports.show = show$1;
  exports.spaceSep = spaceSep;
  exports.style = style;
  exports.tag = tag;
  exports.tags = tags;
  exports.text = text$2;
  exports.textbox = textbox;
  exports.toFragment = toFragment;
  exports.toggle = toggle$1;
  exports.toggleClass = toggleClass;
  exports.value = value$2;
  exports.wrap = wrap;

  Object.defineProperty(exports, '__esModule', { value: true });

});
