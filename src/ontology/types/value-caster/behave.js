import * as _ from "atomic/core";
import {ICaster} from "../../protocols/icaster/instance.js";

function cast(self, value){
  return _.into(self.emptyColl, _.maybe(value, _.array));
}

function uncast(self, coll){
  return _.last(coll);
}

export default _.does(
  _.implement(ICaster, {cast, uncast}));
