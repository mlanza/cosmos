import * as _ from "atomic/core";

export function CastHandler(buffer, provider){
  this.buffer = buffer;
  this.provider = provider;
}

export const castHandler = _.constructs(CastHandler);
