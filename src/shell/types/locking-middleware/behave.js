import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, message, next){
  if (self.handling) {
    self.queued.push(message);
  } else {
    self.handling = true;
    next(message);
    self.handling = false;
    if (self.queued.length) {
      var queued = self.queued;
      self.queued = [];
      _.log("draining queued", queued);
      _.each($.dispatch(self.bus, _), queued);
    }
  }
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
