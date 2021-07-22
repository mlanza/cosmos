import * as _ from "atomic/core";
//import * as p from "./protocols/concrete.js";
//export * from "./protocols.js";
//export * from "./protocols/concrete.js";
export * from "./types.js";

export function defs(construct, keys){
  return _.reduce(function(memo, key){
    return _.assoc(memo, key, construct(key));
  }, {}, keys);
}
