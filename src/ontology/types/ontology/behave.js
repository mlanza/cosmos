import * as _ from "atomic/core";

function conj(self, topic){
  return new self.constructor(_.assoc(self.topics, _.identifier(topic), topic));
}

function lookup(self, key){
  return _.get(self.topics, key);
}

function keys(self){
  return _.keys(self.topics);
}

function vals(self){
  return _.vals(self.topics);
}

function dissoc(self, key){
  return new self.constructor(_.dissoc(self.topics, key));
}

function merge(self, other){
  return _.reduce(_.conj, self, _.vals(other));
}

export default _.does(
  _.implement(_.IMergable, {merge}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.ICollection, {conj}));
