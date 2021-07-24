import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as w from "cosmos/work";
import * as ont from "cosmos/ontology";

function handle(self, event, next){
  const args = _.get(event, "args"),
        key = _.first(args),
        value = _.second(args),
        id = _.get(event, "id");

  _.swap(self.buffer, function(buffer){
    return w.edit(buffer, _.mapa(function(id){
      return ont.assert(_.get(buffer, id), key, value);
    }, id));
  });

  next(event);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
