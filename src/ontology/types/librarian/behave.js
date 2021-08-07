import * as _ from "atomic/core";
import {ICatalogue} from "../../protocols/icatalogue/instance.js";

function conj(self, strategy){
  return new self.constructor(_.conj(self.strategies, strategy));
}

function indices(self, triple){
  return self.strategies
    |> _.map(_.applying(triple), ?)
    |> _.compact;
}

export default _.does(
  _.implement(ICatalogue, {indices}),
  _.implement(_.ICollection, {conj}));
