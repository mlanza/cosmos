import * as _ from "atomic/core";

export function JsonRepo(url, ontology) {
  this.url = url;
  this.ontology = ontology;
}

export const jsonRepo = _.constructs(JsonRepo);
