import * as _ from "atomic/core";
import {assertionStore} from "./construct.js";

function reviseStore(manner){
  return function(self, assertion){
    return assertionStore(self.questions, _.reduce(function(memo, question){
      return _.update(memo, question, function(answers){
        return manner(answers || imm.set(), assertion);
      });
    }, self.assertions, self.questions(assertion)));
  }
}

function lookup(self, assertion){
  return _.seq(_.get(self.assertions, assertion));
}

const conj = reviseStore(_.conj);
const disj = reviseStore(_.disj);

export default _.does(
  _.implement(_.ICollection, {conj}),
  _.implement(_.ISet, {disj}),
  _.implement(_.ILookup, {lookup}));
