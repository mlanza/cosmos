import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, event, next){
  const id = _.get(event, "id");
  _.swap(self.model,
    _.update(_, "selected",
      _.apply(_.conj, _, id)));
  next(event);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
