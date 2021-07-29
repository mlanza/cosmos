import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as w from "cosmos/work";

function handle(self, command, next){
  const id = _.get(command, "id"),
        key = _.getIn(command, ["args", 0]);
  _.swap(self.buffer, w.modify(?, _.update(_, key, _.mapa(_.not, _)), ...id));
  next(command);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
