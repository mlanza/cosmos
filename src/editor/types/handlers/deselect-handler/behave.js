import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as sh from "cosmos/shell";

function handle(self, command, next){
  $.raise(self.provider, sh.effect(command, "deselected"));
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
