export * from "./query-handler/construct.js";
import {QueryHandler} from "./query-handler/construct.js";
import behave from "./query-handler/behave.js";
behave(QueryHandler);
