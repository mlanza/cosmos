import * as _ from "atomic/core";

export function QueryHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const queryHandler = _.constructs(QueryHandler);
