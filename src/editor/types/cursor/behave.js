import * as _ from "atomic/core";

function deref(self){
  return _.just(self.source, _.deref, _.deref);
}

function swap(self, f){
  _.swap(self.source, _.fmap(_, f));
}

export default _.does(
  _.implement(_.IDeref, {deref}),
  _.implement(_.ISwap, {swap}));
