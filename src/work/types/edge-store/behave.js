import * as _ from "atomic/core";
import {edgeStore} from "./construct.js";

function reviseStore(manner){
  return function(self, assertion){
    return edgeStore(self.questions, _.reduce(function(memo, question){
      return _.update(memo, question, function(answers){
        return manner(answers || imm.set(), edge);
      });
    }, self.edges, self.questions(edge)));
  }
}

function lookup(self, edge){
  return _.seq(_.get(self.edges, edge));
}

const conj = reviseStore(_.conj);
const disj = reviseStore(_.disj);

export default _.does(
  _.implement(_.ICollection, {conj}),
  _.implement(_.ISet, {disj}),
  _.implement(_.ILookup, {lookup}));
