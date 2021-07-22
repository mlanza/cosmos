import * as _ from "atomic/core";
import * as imm from "atomic/immutables";

export function AssertionStore(questions, assertions){
  this.questions = questions;
  this.assertions = assertions;
}

export const assertionStore = _.fnil(_.constructs(AssertionStore), _.array, imm.map());

export function questions(assertion){
  return [
    assertion,
    _.assoc(assertion, "predicate", null, "object", null),
    _.assoc(assertion, "predicate", null),
    _.assoc(assertion, "subject", null),
    _.assoc(assertion, "object", null)
  ];
}
