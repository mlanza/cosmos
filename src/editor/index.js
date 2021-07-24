import * as _ from "atomic/core";
import * as imm from "atomic/immutables";
export * from "./types.js";
export * as commands from "./types/commands.js";
export * as events from "./types/events.js";

export function dirtyKeys(self, other){
  return self.attrs === other.attrs ? null : _.remove(function(key){
    return self.attrs[key] === other.attrs[key];
  }, imm.distinct(_.concat(_.keys(self.attrs), _.keys(other.attrs))));
}
