import * as _ from "atomic/core";
import * as sh from "atomic/shell";

function handle(self, message, next){
  try {
    next(message);
  } catch (ex){
    self.notify(ex);
  }
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
