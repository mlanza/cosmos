import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, event, next){
  _.just(_.deref(self.model).selected, _.toArray, _.mapa(_.get(_.deref(self.buffer), _), _),_.tee(function(peeked){
    Object.assign(window, {peeked});
  }), _.see("peeked"));
  next(event);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
