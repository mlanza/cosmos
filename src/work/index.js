import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";

export function created(self, id){
  const c = p.change(self, id);
  return _.first(c) && !_.second(c);
}

export function modified(self, id){
  const c = p.change(self, id);
  return _.first(c) && _.second(c);
}

export function destroyed(self, id){
  const c = p.change(self, id);
  return !_.first(c) && _.second(c);
}

export function modify(self, f, ...ids){
  return p.update(self, ..._.mapa(_.comp(f, _.get(self, ?)), ids));
}
