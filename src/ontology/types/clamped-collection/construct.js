import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import {constrainedCollection} from "../constrained-collection/construct.js";

export function ClampedCollection(cardinality, coll){
  this.cardinality = cardinality;
  this.coll = coll;
}

function clampedCollection2(cardinality, coll){
  return new ClampedCollection(cardinality, coll);
}

function clampedCollection1(cardinality){
  return clampedCollection2(cardinality, constrainedCollection(vd.and(cardinality)));
}

export const clampedCollection = _.overload(null, clampedCollection1, clampedCollection2);
export const optional = clampedCollection(vd.opt);
export const required = clampedCollection(vd.req);
