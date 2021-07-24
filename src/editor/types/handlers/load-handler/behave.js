import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as e from "../../events.js";

function handle(self, command, next){
  sh.raise(self.provider, e.loaded(_.get(command, "args")));
  next(command);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
