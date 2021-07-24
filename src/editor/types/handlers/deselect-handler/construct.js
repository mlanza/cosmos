import * as _ from "atomic/core";

export function DeselectHandler(model, provider){
  this.model = model;
  this.provider = provider;
}

export const deselectHandler = _.constructs(DeselectHandler);
