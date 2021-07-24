import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as ont from "cosmos/ontology";

function handle(self, command, next){
  var id = _.get(command, "id"),
      entity = _.get(self.buffer, id);
  if (entity) {
    var key = _.get(command, "key");
    if (_.get(ont.fld(entity, key), self.key)) {
      throw new Error("Field `" + key + "` is " + self.key + " and thus cannot " + _.identifier(command) + ".");
    }
    $.handle(self.handler, command, next);
  }
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
