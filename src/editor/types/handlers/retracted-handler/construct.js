import * as _ from "atomic/core";

export function RetractedHandler(buffer){
  this.buffer = buffer;
}

export const retractedHandler = _.constructs(RetractedHandler);
