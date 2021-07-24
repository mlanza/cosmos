import * as _ from "atomic/core";

export function ToggleHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const toggleHandler = _.constructs(ToggleHandler);
