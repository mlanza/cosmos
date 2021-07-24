import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as repos from "atomic/repos";
import * as e from "../../events.js";

function handle(self, command, next){
  return _.fmap(repos.query(_.deref(self.buffer), _.get(command, "plan")), function(entities){
    $.raise(self.provider, e.queried(entities));
    next(command);
  });
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
