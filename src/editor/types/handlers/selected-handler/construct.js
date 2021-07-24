import * as _ from "atomic/core";

export function SelectedHandler(model){
  this.model = model;
}

export const selectedHandler = _.constructs(SelectedHandler);
