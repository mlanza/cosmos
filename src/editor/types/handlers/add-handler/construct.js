import * as _ from "atomic/core";

export function AddHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const addHandler = _.constructs(AddHandler);
