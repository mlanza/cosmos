import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as e from "../../events.js";
import * as s from "../shared.js";

export default _.does(
  _.implement($.IMiddleware, {handle: s.journaled(_.flush)}));
