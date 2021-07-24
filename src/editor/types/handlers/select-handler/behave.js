import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as e from "../../events.js";

function handle(self, command, next){
  const id = _.get(command, "id");
  const missing = _.detect(_.complement(_.contains(_.deref(self.buffer), _)), id);
  if (!missing) {
    $.raise(self.provider, e.selected([], {id: id}));
  } else {
    throw new Error("Entity " + _.str(missing) + " was not present in buffer.");
  }
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
