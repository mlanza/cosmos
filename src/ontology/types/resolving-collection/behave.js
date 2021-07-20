import * as _ from "atomic/core";
import * as vd from "atomic/validates";

function conj(self, value){
  return new self.constructor(self.constraints, _.conj(self.coll, value));
}

function assoc(self, idx, value){
  return new self.constructor(self.constraints, _.assoc(self.coll, idx, value));
}

function empty(self){
  return new self.constructor(self.constraints, _.empty(self.coll));
}

function constraints1(self){
  return vd.constraints(self.coll);
}

function constraints2(self, constraints){
  return new self.constructor(self.constraints, vd.constraints(self.coll, constraints));
}

const constraints = _.overload(null, constraints1, constraints2);

export default _.does(
  _.forward("coll", _.ISeq, _.INext, _.IInclusive, _.ICounted, _.IIndexed, _.IAssociative, _.ISeqable, _.IDeref, _.IFunctor, _.IReduce, _.IKVReduce),
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.IEmptyableCollection, {empty}),
  _.implement(_.ILookup, {lookup: _.nth}),
  _.implement(_.IAssociative, {assoc}),
  _.implement(_.ICollection, {conj}));
