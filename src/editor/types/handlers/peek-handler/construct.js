import * as _ from "atomic/core";

export function PeekHandler(provider){
  this.provider = provider;
}

export const peekHandler = _.constructs(PeekHandler);
