import * as _ from "atomic/core";

export function LoadHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const loadHandler = _.constructs(LoadHandler);
