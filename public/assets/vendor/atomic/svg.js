define(['exports', 'atomic/core', 'atomic/dom', 'dom'], function (exports, _, dom$1, dom) { 'use strict';

  var taglist = ["svg", "g", "symbol", "defs", "clipPath", "metadata", "path", "line", "circle", "rect", "ellipse", "polygon", "polyline", "image", "text", "tspan"];

  function tags2(document, list) {
    var ns = dom$1.elementns(document, "http://www.w3.org/2000/svg");
    var tags = dom$1.tags(ns, list);

    function use(link) {
      for (var _len = arguments.length, contents = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        contents[_key - 1] = arguments[_key];
      }

      var el = ns("use", contents);
      el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);
      return el;
    }

    tags["use"] = use;
    return tags;
  }

  function tags1(document) {
    return tags2(document, taglist);
  }

  var tags = _.overload(null, tags1, tags2);

  var _tags = tags(dom.document),
      svg = _tags.svg,
      g = _tags.g,
      symbol = _tags.symbol,
      defs = _tags.defs,
      clipPath = _tags.clipPath,
      metadata = _tags.metadata,
      path = _tags.path,
      line = _tags.line,
      circle = _tags.circle,
      rect = _tags.rect,
      ellipse = _tags.ellipse,
      polygon = _tags.polygon,
      polyline = _tags.polyline,
      image = _tags.image,
      text = _tags.text,
      tspan = _tags.tspan,
      use = _tags.use;

  exports.circle = circle;
  exports.clipPath = clipPath;
  exports.defs = defs;
  exports.ellipse = ellipse;
  exports.g = g;
  exports.image = image;
  exports.line = line;
  exports.metadata = metadata;
  exports.path = path;
  exports.polygon = polygon;
  exports.polyline = polyline;
  exports.rect = rect;
  exports.svg = svg;
  exports.symbol = symbol;
  exports.taglist = taglist;
  exports.tags = tags;
  exports.text = text;
  exports.tspan = tspan;
  exports.use = use;

  Object.defineProperty(exports, '__esModule', { value: true });

});
