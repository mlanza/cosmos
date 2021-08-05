import * as _ from "atomic/core";

export function Edge(attrs){
  this.attrs = attrs;
}

export const edge = _.pre(function edge(subject, predicate, object){
  return new Edge({subject, predicate, object});
}, _.signature(_.isSome, _.isString, _.isSome));
