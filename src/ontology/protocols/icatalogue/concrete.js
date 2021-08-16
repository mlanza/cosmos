import * as _ from "atomic/core";
import {ICatalogue} from "./instance.js";

const indices2 = ICatalogue.indices;
function indicesN(self, ...triples){
  return _.mapcat(indices2(self, ?), triples);
}

export const indices = _.overload(null, null, indices2, indicesN);
export const search = ICatalogue.search;
