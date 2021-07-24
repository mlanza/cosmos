import * as _ from "atomic/core";
import * as sh from "atomic/shell";

function handle(self, event, next){
  _.swap(self.effects, _.conj(_, event));
  next(event);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
