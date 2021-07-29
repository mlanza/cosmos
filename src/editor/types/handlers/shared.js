import * as _ from "atomic/core";
import * as sh from "atomic/shell";

export function existing(event){
  return function handle(self, command, next){
    const e = Object.assign(event(), command, {type: event().type});
    const id = _.get(command, "id");
    const f = _.everyPred(_.contains(_.deref(self.buffer), ?));
    if (_.apply(f, id)) {
      sh.raise(self.provider, e);
    } else {
      throw new Error("Targeted unknown entities.");
    }
    next(command);
  }
}

export function journal(able, event){
  return function handle(self, command, next){
    if (able(_.deref(self.state))){
      sh.raise(self.provider, event);
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
