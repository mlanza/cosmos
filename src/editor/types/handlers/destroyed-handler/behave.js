import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as w from "cosmos/work";

function handle(self, event, next){
  var id = _.get(event, "id");
  _.swap(self.buffer, function(buffer){
    return w.destroy(buffer, _.mapa(_.get(buffer, _), id));
  });

  next(event);
}

export default _.doto(
  _.implement($.IMiddleware, {handle}));
