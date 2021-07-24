export * from "./undo-handler/construct.js";
import {UndoHandler} from "./undo-handler/construct.js";
import behave from "./undo-handler/behave.js";
behave(UndoHandler);
