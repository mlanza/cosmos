import * as _ from "atomic/core";
import * as sh from "atomic/shell";

function handle(self, event, next){
  const id = _.get(event, "id");
  _.swap(self.selected,
    _.apply(_.conj, _, id));
  next(event);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
