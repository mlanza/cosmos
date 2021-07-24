import * as _ from "atomic/core";

export function KeyedMiddleware(key, value){
  this.key = key;
  this.value = value;
}

export const keyedMiddleware = _.constructs(KeyedMiddleware);
