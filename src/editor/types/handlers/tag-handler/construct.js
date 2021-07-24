import * as _ from "atomic/core";

export function TagHandler(handler){
  this.handler = handler;
}

export const tagHandler = _.constructs(TagHandler);
