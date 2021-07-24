import * as _ from "atomic/core";

export function SelectHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const selectHandler = _.constructs(SelectHandler);
