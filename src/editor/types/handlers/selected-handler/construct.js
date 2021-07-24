import * as _ from "atomic/core";

export function SelectedHandler(selected){
  this.selected = selected;
}

export const selectedHandler = _.constructs(SelectedHandler);
