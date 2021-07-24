import * as _ from "atomic/core";

export function PeekedHandler(buffer, selected, effect){
  this.buffer = buffer;
  this.selected = selected;
  this.effect = effect;
}

export const peekedHandler = _.constructs(PeekedHandler);
