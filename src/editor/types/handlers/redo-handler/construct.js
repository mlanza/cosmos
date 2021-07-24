import * as _ from "atomic/core";

export function RedoHandler(state, provider){
  this.state = state;
  this.provider = provider;
}

export const redoHandler = _.constructs(RedoHandler);
