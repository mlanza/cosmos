export * from "./transaction/construct.js";
import {Transaction} from "./transaction/construct.js";
import behave from "./transaction/behave.js";
behave(Transaction);
