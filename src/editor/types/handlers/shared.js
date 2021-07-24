import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

export function existing(event){
  return function handle(self, command, next){
    var e = Object.assign(event(), command, {type: event().type});
    //var id = _.get(command, "id");
    //if (_.apply(_.everyPred, _.contains(self.buffer, _), id)) {
      $.raise(self.provider, e);
    //}
    next(command);
  }
}

export function journal(able, event){
  return function handle(self, command, next){
    if (able(_.deref(self.state))){
      $.raise(self.provider, event);
    }
    next(command);
  }
}

export function journaled(effect){
  return function handle(self, event, next){
    _.swap(self.state, effect);
    next(event);
  }
}
