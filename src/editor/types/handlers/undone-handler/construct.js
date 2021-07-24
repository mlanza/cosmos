import * as _ from "atomic/core";

export function UndoneHandler(state){
  this.state = state;
}

export const undoneHandler = _.constructs(UndoneHandler);
