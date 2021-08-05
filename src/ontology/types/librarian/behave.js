import * as _ from "atomic/core";
import {ISearchable} from "../../protocols/isearchable/instance.js";

function conj(self, strategy){
  return new self.constructor(_.conj(self.strategies, strategy));
}

function indices(self, triple){
  return self.strategies
    |> _.map(_.applying(triple), ?)
    |> _.compact;
}

export default _.does(
  _.implement(ISearchable, {indices}),
  _.implement(_.ICollection, {conj}));
