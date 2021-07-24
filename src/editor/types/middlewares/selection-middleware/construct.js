import * as _ from "atomic/core";

export function SelectionMiddleware(model, pred){
  this.model = model;
  this.pred = pred;
}

export const selectionMiddleware = _.constructs(SelectionMiddleware);
