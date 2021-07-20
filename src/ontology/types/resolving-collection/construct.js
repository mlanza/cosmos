import * as _ from "atomic/core";

export function ResolvingCollection(constraints, coll){
  this.constraints = constraints;
  this.coll = coll;
}

export const resolvingCollection = _.constructs(ResolvingCollection);
