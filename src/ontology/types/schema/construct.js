import * as _ from "atomic/core";

export function Schema(fields){
  this.fields = fields;
}

export const schema = _.constructs(Schema);
