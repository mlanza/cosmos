import * as _ from "atomic/core";

export function EffectedHandler(effects){
  this.effects = effects;
}

export const effectedHandler = _.constructs(EffectedHandler);
