import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as ont from "cosmos/ontology";

function handle(self, command, next){
  const id = _.get(command, "id"),
        entity = _.get(self.buffer, id);
  if (entity) {
    const key = _.get(command, "key");
    if (_.get(ont.fld(entity, key), self.key)) {
      throw new Error("Field `" + key + "` is " + self.key + " and thus cannot " + _.identifier(command) + ".");
    }
    sh.handle(self.handler, command, next);
  }
  next(command);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
