import * as _ from "atomic/core";

export function DestroyHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const destroyHandler = _.constructs(DestroyHandler);
