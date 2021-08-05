export * from "./criterion/construct.js";
export * from "./criterion/concrete.js";
import {Criterion} from "./criterion/construct.js";
import behave from "./criterion/behave.js";
behave(Criterion);
