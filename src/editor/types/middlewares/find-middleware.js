export * from "./find-middleware/construct.js";
import {FindMiddleware} from "./find-middleware/construct.js";
import behave from "./find-middleware/behave.js";
behave(FindMiddleware);
