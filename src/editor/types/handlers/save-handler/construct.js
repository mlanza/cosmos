import * as _ from "atomic/core";

export function SaveHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const saveHandler = _.constructs(SaveHandler);
