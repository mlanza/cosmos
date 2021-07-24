import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as e from "../../events.js";

function handle(self, command, next){
  $.raise(self.provider, e.loaded(_.get(command, "args")));
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
