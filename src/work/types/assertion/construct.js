export function Assertion(attrs){
  this.attrs = attrs;
}

export function assertion(subject, predicate, object){
  return new Assertion({subject: subject, predicate: predicate, object: object});
}
