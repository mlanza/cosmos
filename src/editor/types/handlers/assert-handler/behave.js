import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as s from "../shared.js";
import * as e from "../../events.js";

export default _.does(
  _.implement($.IMiddleware, {handle: s.existing(e.asserted)}));
