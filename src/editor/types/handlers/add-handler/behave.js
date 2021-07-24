import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as e from "../../events.js";

function handle(self, command, next){
  const id = _.get(command, "id") || _.guid(), //TODO guid is dep
        args = _.get(command, "args");;
  $.raise(self.provider, e.added(args, {id: id}));
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
