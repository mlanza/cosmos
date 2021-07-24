import * as _ from "atomic/core";

export function RedoneHandler(state){
  this.state = state;
}

export const redoneHandler = _.constructs(RedoneHandler);
