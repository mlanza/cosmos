export * from "./keyed-middleware/construct.js";
import {KeyedMiddleware} from "./keyed-middleware/construct.js";
import behave from "./keyed-middleware/behave.js";
behave(KeyedMiddleware);
