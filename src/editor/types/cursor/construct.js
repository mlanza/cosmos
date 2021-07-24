import * as _ from "atomic/core";

export function Cursor(source){
  this.source = source;
}

export const cursor = _.constructs(Cursor);
