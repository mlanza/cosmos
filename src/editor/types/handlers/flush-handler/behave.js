import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as e from "../../events.js";
import * as s from "../shared.js";

export default _.does(
  _.implement(sh.IMiddleware, {handle: s.journal(_.constantly(true), e.flushed())}));
