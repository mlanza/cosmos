import * as _ from "atomic/core";
import * as w from "cosmos/work";
import {tiddles} from "../../protocols/itiddler/concrete.js";

export default _.does(
  w.ientity,
  tiddles("title", "text"));
