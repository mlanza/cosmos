import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as w from "cosmos/work";

function handle(self, command, next){
  var id = _.get(command, "id"),
      key = _.getIn(command, ["args", 0]);
  _.swap(self.buffer, function(buffer){
    return w.edit(buffer, _.mapa(_.pipe(_.get(buffer, _), _.update(_, key, _.mapa(_.not, _))), id));
  });
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
