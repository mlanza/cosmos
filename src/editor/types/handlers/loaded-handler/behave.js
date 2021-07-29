import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as w from "cosmos/work";

function handle(self, event, next){
  _.swap(self.buffer, function(buffer){
    return w.load(buffer, ..._.get(event, "args"));
  });
  next(event);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));

