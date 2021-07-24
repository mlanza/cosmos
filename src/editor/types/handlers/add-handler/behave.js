import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as ont from "cosmos/ontology";
import * as e from "../../events.js";

function handle(self, command, next){
  const args = _.get(command, "args"),
        type = _.first(args),
        id = _.get(command, "id") || ont.nextId(self.maker, type);
  $.raise(self.provider, e.added(args, {id}));
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
