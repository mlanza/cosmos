import * as _ from "atomic/core";

export function UntagHandler(handler){
  this.handler = handler;
}

export const untagHandler = _.constructs(UntagHandler);
