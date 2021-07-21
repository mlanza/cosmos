import * as _ from "atomic/core";

export function ValuesCaster(emptyColl){
  this.emptyColl = emptyColl;
}

export const valuesCaster = _.constructs(ValuesCaster);
