import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, message, next){
  _.just(message,
    _.assoc(_, self.key, self.value()),
    next);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
