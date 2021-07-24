import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function dispatch(self, message){
  $.dispatch(self.commandBus, message);
}

function lookup(self, id){ //TODO drop — for development purposes
  return _.get(self.buffer, id);
}

function sub(self, observer){ //TODO provide separate set of external events (e.g. don't expose its internals)
  return $.sub(self.emitter, observer);
}

export default _.does(
  _.implement(_.ILookup, {lookup}),
  _.implement($.IDispatch, {dispatch}),
  _.implement($.ISubscribe, {sub}));
