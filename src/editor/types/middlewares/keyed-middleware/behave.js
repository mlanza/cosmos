import * as _ from "atomic/core";
import * as sh from "atomic/shell";

function handle(self, message, next){
  _.just(message,
    _.assoc(_, self.key, self.value()),
    next);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
