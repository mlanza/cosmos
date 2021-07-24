import * as _ from "atomic/core";

export function RetractHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const retractHandler = _.constructs(RetractHandler);
