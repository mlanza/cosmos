import * as _ from "atomic/core";

export function Recaster(cast, uncast, caster){
  this.cast = cast;
  this.uncast = uncast;
  this.caster = caster;
}

export const recaster = _.constructs(Recaster);
