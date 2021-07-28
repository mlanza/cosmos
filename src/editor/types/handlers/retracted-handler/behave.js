import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as w from "cosmos/work";
import * as ont from "cosmos/ontology";

function handle(self, event, next){
  const key = _.getIn(event, ["args", 0]),
        value = _.getIn(event, ["args", 1]),
        id = _.get(event, "id");

  _.swap(self.buffer, function(buffer){
    return w.update(buffer, _.mapa(function(id){
      const entity = _.get(buffer, id);
      return _.isSome(value) ? ont.retract(entity, key, value) : ont.retract(entity, key);
    }, id));
  });

  next(event);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
