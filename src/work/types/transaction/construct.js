import * as _ from "atomic/core";

export function Transaction(buffer, user){
  this.buffer = buffer;
  this.user = user;
}

export const transaction = _.constructs(Transaction);
