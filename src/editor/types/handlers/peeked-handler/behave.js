import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, event, next){
  _.just(self.selected, _.deref, _.mapa(_.get(_.deref(self.buffer), _), _), self.effect);
  next(event);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
