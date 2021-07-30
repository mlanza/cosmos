export function Edge(attrs){
  this.attrs = attrs;
}

export function edge(subject, predicate, object){
  return new Edge({subject: subject, predicate: predicate, object: object});
}
