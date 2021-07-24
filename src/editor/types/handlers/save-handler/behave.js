import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as w from "cosmos/work";
import * as e from "../../events.js";

function handle(self, command){
  w.save(self.buffer)
  $.raise(self.provider, e.saved());
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
