import * as _ from "atomic/core";

export function BlockingHandler(key, buffer, handler){
  this.key = key;
  this.buffer = buffer;
  this.handler = handler;
}

export const blockingHandler = _.constructs(BlockingHandler);
