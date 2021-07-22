import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as mut from "atomic/transients";

function assoc(self, key, handler){
  self.handlers = _.assoc(self.handlers, key, handler);
}

function handle(self, message, next){
  var handler = _.get(self.handlers, self.identify(message), self.fallback);
  if (handler){
    $.handle(handler, message, next);
  } else {
    next(message);
  }
}

export default _.does(
  _.implement(mut.ITransientAssociative, {assoc}),
  _.implement($.IMiddleware, {handle}));
