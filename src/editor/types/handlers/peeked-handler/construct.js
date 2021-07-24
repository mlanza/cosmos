import * as _ from "atomic/core";

export function PeekedHandler(buffer, model){
  this.buffer = buffer;
  this.model = model;
}

export const peekedHandler = _.constructs(PeekedHandler);
