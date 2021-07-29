import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as w from "cosmos/work";
import * as ont from "cosmos/ontology";

function handle(self, event, next){
  const key = _.getIn(event, ["args", 0]),
        value = _.getIn(event, ["args", 1]),
        id = _.get(event, "id");

  _.swap(self.buffer, w.modify(?, _.isSome(value) ? ont.retract(?, key, value) : ont.retract(?, key), ...id));

  next(event);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
