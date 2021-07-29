import * as _ from "atomic/core";

export function ErrorMiddleware(notify){
  this.notify = notify;
}

export const errorMiddleware = _.constructs(ErrorMiddleware);
