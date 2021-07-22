export * from "./tiddler/construct.js";
import {Tiddler} from "./tiddler/construct.js";
import behave from "./tiddler/behave.js";
behave(Tiddler);
