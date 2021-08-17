import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function deref(self){
  return _.just(self.source, _.deref, _.deref);
}

function swap(self, f){
  _.swap(self.source, _.fmap(_, f));
}

function sub(self, callback){
  return _.just(self.source, $.sub(?, callback));
}

export default _.does(
  _.implement($.ISubscribe, {sub}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.ISwap, {swap}));
