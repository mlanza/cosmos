export * from "./error-middleware/construct.js";
import {ErrorMiddleware} from "./error-middleware/construct.js";
import behave from "./error-middleware/behave.js";
behave(ErrorMiddleware);
