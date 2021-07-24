export * from "./selection-middleware/construct.js";
import {SelectionMiddleware} from "./selection-middleware/construct.js";
import behave from "./selection-middleware/behave.js";
behave(SelectionMiddleware);
