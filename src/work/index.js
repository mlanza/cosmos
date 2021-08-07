import * as _ from "atomic/core";
import * as ont from "cosmos/ontology";
import * as p from "./protocols/concrete.js";
import {IVertex} from "./protocols/ivertex/instance.js";
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

_.doto(_.Nil, _.implement(IVertex, {outs: _.constantly([])}));
