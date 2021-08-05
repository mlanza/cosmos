import * as _ from "atomic/core";
import {criterion} from "../../types/criterion/construct.js";

export function prepositionally(f){
  return function(triple){
    const s = _.get(triple, "subject"),
          p = _.get(triple, "predicate"),
          o = _.get(triple, "object");
    return f(s, p, o)
      ? criterion(null, p, o)
      : null;
  }
}

export function objectively(f){
  return function(triple){
    const s = _.get(triple, "subject"),
          p = _.get(triple, "predicate"),
          o = _.get(triple, "object");
    return f(s, p, o)
      ? criterion(null, null, o)
      : null;
  }
}

function typed1(f){
  return prepositionally(_.signature(null, f, null));
}

function typed2(f, g){
  return function(triple){
    const p = _.get(triple, "predicate"),
          o = _.get(triple, "object");
    return f(p)
      ? criterion(null, p, g(o))
      : null;
  }
}

export const typed = _.overload(null, typed1, typed2);
