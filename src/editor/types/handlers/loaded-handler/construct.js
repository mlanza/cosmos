import * as _ from "atomic/core";

export function LoadedHandler(buffer){
  this.buffer = buffer;
}

export const loadedHandler = _.constructs(LoadedHandler);
