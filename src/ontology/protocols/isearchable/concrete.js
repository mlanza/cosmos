import * as _ from "atomic/core";
import {ISearchable} from "./instance.js";

const indices2 = ISearchable.indices;
function indicesN(self, ...triples){
  return _.mapcat(indices2(self, ?), triples);
}

export const indices = _.overload(null, null, indices2, indicesN);
