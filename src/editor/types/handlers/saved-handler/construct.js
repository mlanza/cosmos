import * as _ from "atomic/core";

export function SavedHandler(commandBus){
  this.commandBus = commandBus;
}

export const savedHandler = _.constructs(SavedHandler);
