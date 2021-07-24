import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, event, next){
  var id = _.get(event, "id");
  _.swap(self.model,
    _.update(_, "selected",
      _.apply(_.disj, _, id))); //_.comp(_.toArray, _.remove(_.includes(id, _), _))
  next(event);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
