import * as _ from "atomic/core";
import * as imm from "atomic/immutables";

export function EdgeStore(questions, edges){
  this.questions = questions;
  this.edges = edges;
}

export const edgeStore = _.fnil(_.constructs(EdgeStore), _.array, imm.map());

export function questions(edge){
  return [
    edge,
    _.assoc(edge, "predicate", null, "object", null),
    _.assoc(edge, "predicate", null),
    _.assoc(edge, "subject", null),
    _.assoc(edge, "object", null)
  ];
}
