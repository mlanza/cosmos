import * as _ from "atomic/core";

export function Change(id, prior, current, op){
  this.id = id;
  this.prior = prior;
  this.current = current;
  this.op = op;
}

export const change = _.constructs(Change);
