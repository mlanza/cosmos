import * as _ from "atomic/core";
import {ICaster} from "../../protocols/icaster/instance.js";

function cast(self, values){
  return _.into(self.emptyColl, values);
}

function uncast(self, coll){
  return _.deref(coll);
}

export default _.does(
  _.implement(ICaster, {cast, uncast}));
