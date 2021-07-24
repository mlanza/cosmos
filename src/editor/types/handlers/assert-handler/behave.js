import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as s from "../shared.js";
import * as e from "../../events.js";

export default _.does(
  _.implement(sh.IMiddleware, {handle: s.existing(e.asserted)}));
