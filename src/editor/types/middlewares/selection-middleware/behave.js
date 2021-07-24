import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, message, next){
  if (!_.contains(message, "id") && self.pred(message)) {
    _.just(
      self.model,
      _.deref,
      _.get(_, "selected"), //a sequence!
      _.toArray,
      _.assoc(message, "id", _),
      next);
  } else {
    next(message);
  }
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
