import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as c from "../../commands.js";

function handle(self, event, next){
  sh.dispatch(self.commandBus, c.load(_.get(event, "args")));
  next(event);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
