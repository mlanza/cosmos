import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as c from "../../commands.js";

function handle(self, event, next){
  $.dispatch(self.commandBus, c.flush());
  next(event);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
