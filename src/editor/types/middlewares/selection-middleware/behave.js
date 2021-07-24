import * as _ from "atomic/core";
import * as sh from "atomic/shell";

function handle(self, message, next){
  if (!_.contains(message, "id") && self.pred(message)) {
    _.just(self.selected,
      _.deref,
      _.toArray,
      _.assoc(message, "id", ?),
      next);
  } else {
    next(message);
  }
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
