import * as _ from "atomic/core";
import {valueCaster} from "../value-caster/construct.js";
import {optional} from "../clamped-collection/construct.js";

export function Field(attrs, caster){
  this.attrs = attrs;
  this.caster = caster;
}

function field3(key, emptyColl, casts){
  return new Field({key: key, readonly: false, missing: false, computed: false}, casts(emptyColl)); //include defaults here
}

function field2(key, emptyColl){
  return field3(key, emptyColl, valueCaster);
}

function field1(key){
  return field2(key, optional);
}

export const field = _.overload(null, field1, field2, field3);
