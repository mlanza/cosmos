import * as _ from "atomic/core";
export function AssertHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const assertHandler = _.constructs(AssertHandler);
