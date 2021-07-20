import * as _ from "atomic/core";
import * as vd from "atomic/validates";

function reduce(self, xf, init){
  var memo = init,
      ys = self;
  while(_.seq(ys)){
    var y = _.first(ys);
    memo = xf(memo, y);
    ys = _.rest(ys);
  }
  return memo;
}

function reducekv(self, xf, init){
  return _.reduce(function(memo, idx){
    return xf(memo, idx, _.nth(self, idx));
  }, init, _.range(0, count(self)));
}

function conj(self, value){
  return new self.constructor(self.constraints, _.conj(self.coll, value));
}

function equiv(self, other){
  return self === other; //TODO self.constructor === other.constructor && _.every()
}

function assoc(self, idx, value){
  return new self.constructor(self.constraints, _.assoc(self.coll, idx, value));
}

function seq(self){
  return _.seq(self.coll) ? self : null;
}

function empty(self){
  return new self.constructor(self.constraints, _.empty(self.coll));
}

function deref(self){
  return self.coll;
}

function fmap(self, f){
  return new self.constructor(self.constraints, _.fmap(self.coll, f));
}

function constraints1(self){
  return self.constraints;
}

function constraints2(self, constraints){
  return new self.constructor(constraints, self.coll);
}

var constraints = _.overload(null, constraints1, constraints2);

export default _.does(
  _.forward("coll", _.ISeq, _.INext, _.IInclusive, _.ICounted, _.IIndexed, _.IAssociative),
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.IEmptyableCollection, {empty}),
  _.implement(_.IFunctor, {fmap}),
  _.implement(_.ILookup, {lookup: _.nth}),
  _.implement(_.IAssociative, {assoc}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IReduce, {reduce}),
  _.implement(_.IKVReduce, {reducekv}),
  _.implement(_.IEquiv, {equiv}),
  _.implement(_.ICollection, {conj}),
  _.implement(_.ISeqable, {seq}));
