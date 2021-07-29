import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as w from "cosmos/work";

function handle(self, event, next){
  const id = _.get(event, "id");
  _.swap(self.buffer, w.destroy(?, ...id));
  next(event);
}

export default _.doto(
  _.implement(sh.IMiddleware, {handle}));
