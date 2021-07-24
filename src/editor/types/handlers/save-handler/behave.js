import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as w from "cosmos/work";
import * as e from "../../events.js";

function handle(self, command){
  w.save(self.buffer)
  sh.raise(self.provider, e.saved());
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
