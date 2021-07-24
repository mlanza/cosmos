import * as _ from "atomic/core";

export function UndoHandler(state, provider){
  this.state = state;
  this.provider = provider;
}

export const undoHandler = _.constructs(UndoHandler);
