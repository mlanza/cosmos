import * as _ from "atomic/core";
import * as imm from "atomic/immutables";
export default _.does(
  _.forward("attrs", imm.IHash),
  _.record);
