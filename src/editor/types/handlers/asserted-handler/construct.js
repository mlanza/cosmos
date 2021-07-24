import * as _ from "atomic/core";
export function AssertedHandler(buffer){
  this.buffer = buffer;
}

export const assertedHandler = _.constructs(AssertedHandler);
