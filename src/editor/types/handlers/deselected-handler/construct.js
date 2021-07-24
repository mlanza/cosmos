import * as _ from "atomic/core";

export function DeselectedHandler(model){
  this.model = model;
}

export const deselectedHandler = _.constructs(DeselectedHandler);
