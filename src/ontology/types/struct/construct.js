import * as _ from "atomic/core";

export function Struct(fields){
  this.fields = fields;
}

export const struct = _.constructs(Struct);
