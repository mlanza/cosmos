import * as _ from "atomic/core";

export function AddHandler(maker, buffer, provider){
  this.maker = maker,
  this.buffer = buffer;
  this.provider = provider;
}

export const addHandler = _.constructs(AddHandler);
