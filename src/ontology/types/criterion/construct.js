import * as _ from "atomic/core";

export function Criterion(attrs){
  this.attrs = attrs;
}

export const criterion = _.pre(function criterion(subject, predicate, object){
  return new Criterion({subject, predicate, object});
}, function(subject, predicate, object){
  return subject != null || predicate != null || object != null;
});
