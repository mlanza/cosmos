import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, command, next){
  next(command);
  _.each(function(message){
    $.handle(self.eventBus, message, next);
  }, $.release(self.provider));
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
