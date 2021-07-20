import * as _ from "atomic/core";
import * as vd from "atomic/validates";

export function ConstrainedCollection(constraints, coll){
  this.constraints = constraints;
  this.coll = coll;
}

export const constrainedCollection = _.fnil(_.constructs(ConstrainedCollection), vd.and(vd.opt), [], []);
