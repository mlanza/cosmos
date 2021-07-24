import * as _ from "atomic/core";

export function ToggledHandler(buffer){
  this.buffer = buffer;
}

export const toggledHandler = _.constructs(ToggledHandler);
