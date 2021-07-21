import * as _ from "atomic/core";
import {ICaster} from "../../protocols/icaster/instance.js";
import * as p from "../../protocols/concrete.js";

function cast(self, values){
  return _.fmap(ont.cast(self.caster, values), self.cast);
}

function uncast(self, coll){
  return p.uncast(self.caster, _.fmap(coll, self.uncast));
}

export default _.does(
  _.implement(ICaster, {cast, uncast}));
