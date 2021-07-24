import * as _ from "atomic/core";

export function EffectHandler(provider, effect){
  this.provider = provider;
  this.effect = effect;
}

export const effectHandler = _.constructs(EffectHandler);
