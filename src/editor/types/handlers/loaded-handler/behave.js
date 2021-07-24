import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as w from "cosmos/work";

function handle(self, event, next){
  _.swap(self.buffer, function(buffer){
    return w.load(buffer, _.get(event, "args"));
  });
  next(event);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));

