import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as w from "cosmos/work";
import * as ont from "cosmos/ontology";

function handle(self, event, next){
  const args = _.get(event, "args"),
        f = _.apply(ont.retract, ?, args),
        id = _.get(event, "id");

  _.swap(self.buffer, w.modify(?, f, ...id));

  next(event);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
