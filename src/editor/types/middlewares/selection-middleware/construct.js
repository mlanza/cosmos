import * as _ from "atomic/core";

export function SelectionMiddleware(selected, pred){
  this.selected = selected;
  this.pred = pred;
}

export const selectionMiddleware = _.constructs(SelectionMiddleware);
