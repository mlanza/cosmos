import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";

export function destroyed(self, id){
  return p.loaded(self, id) && !_.get(self, id);
}

export function created(self, id){
  return !p.loaded(self, id) && p.changed(self, id);
}

export function updated(self, id){
  return p.loaded(self, id) && p.changed(self, id);
}
