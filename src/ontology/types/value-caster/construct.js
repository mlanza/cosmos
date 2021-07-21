import * as _ from "atomic/core";

export function ValueCaster(emptyColl){
  this.emptyColl = emptyColl;
}

export const valueCaster = _.constructs(ValueCaster);
