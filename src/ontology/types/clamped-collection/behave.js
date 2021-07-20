import * as _ from "atomic/core";
import * as vd from "atomic/validates";

function fmap(self, f){
  return new self.constructor(self.cardinality, _.fmap(self.coll, f));
}

function conj(self, value){
  const coll = _.conj(self.coll, value);
  return new self.constructor(self.cardinality, _.into(_.empty(coll), _.drop(_.max(_.count(coll) - _.end(self.cardinality), 0), coll)));
}

function assoc(self, idx, value){
  return new self.constructor(self.cardinality, _.assoc(self.coll, idx, value));
}

function empty(self){
  return new self.constructor(self.cardinality, _.into(_.empty(self.coll), _.take(_.start(self.cardinality), self.coll)));
}

function constraints1(self){
  return vd.constraints(self.coll);
}

function constraints2(self, constraints){
  return new self.constructor(self.cardinality, vd.constraints(self.coll, constraints));
}

const constraints = _.overload(null, constraints1, constraints2);

export default _.does(
  _.forward("coll", _.IReduce, _.IKVReduce, _.ISeq, _.INext, _.ICounted, _.IInclusive, _.IEquiv, _.IIndexed, _.IAssociative, _.ISeqable, _.IDeref),
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.IEmptyableCollection, {empty}),
  _.implement(_.IFunctor, {fmap}),
  _.implement(_.ILookup, {lookup: _.nth}),
  _.implement(_.IAssociative, {assoc}),
  _.implement(_.ICollection, {conj}));
