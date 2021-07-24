import * as _ from "atomic/core";

export function DestroyedHandler(buffer){
  this.buffer = buffer;
}

export const destroyedHandler = _.constructs(DestroyedHandler);
