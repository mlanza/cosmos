import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as sh from "cosmos/shell";

function handle(self, command, next){
  const altered =  _.just(command, sh.alter(_, "retract"), _.update(_, "args", _.pipe(_.cons("tag", _), _.toArray)));
  $.handle(self.handler, altered, next);
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
