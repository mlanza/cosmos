import * as _ from "atomic/core";

export function QueriedHandler(commandBus){
  this.commandBus = commandBus;
}

export const queriedHandler = _.constructs(QueriedHandler);
