import * as _ from "atomic/core";

function conj(self, field){
  return new self.constructor(_.assoc(self.fields, _.identifier(field), field));
}

function lookup(self, key){
  return _.get(self.fields, key);
}

function keys(self){
  return _.keys(self.fields);
}

function vals(self){
  return _.vals(self.fields);
}

function dissoc(self, key){
  return new self.constructor(_.dissoc(self.fields, key));
}

function merge(self, other){
  return _.reduce(_.conj, self, _.vals(other));
}

export default _.does(
  _.implement(_.IMergable, {merge}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.ICollection, {conj}));
