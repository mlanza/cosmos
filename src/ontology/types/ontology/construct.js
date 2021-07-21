export function Ontology(topics){
  this.topics = topics;
}

export function ontology(topics){
  return new Ontology(topics || {});
}
