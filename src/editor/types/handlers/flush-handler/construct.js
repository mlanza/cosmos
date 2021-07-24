import * as _ from "atomic/core";

export function FlushHandler(state, provider){
  this.state = state;
  this.provider = provider;
}

export const flushHandler = _.constructs(FlushHandler);
