import * as _ from "atomic/core";

export function FlushedHandler(state, provider){
  this.state = state;
  this.provider = provider;
}

export const flushedHandler = _.constructs(FlushedHandler);
