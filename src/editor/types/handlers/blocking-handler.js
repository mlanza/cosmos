export * from "./blocking-handler/construct.js";
import {BlockingHandler} from "./blocking-handler/construct.js";
import behave from "./blocking-handler/behave.js";
behave(BlockingHandler);
