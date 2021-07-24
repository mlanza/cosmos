import * as _ from "atomic/core";
import * as sh from "atomic/shell";

function handle(self, command, next){
  sh.raise(self.provider, sh.effect(command, "deselected"));
  next(command);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
