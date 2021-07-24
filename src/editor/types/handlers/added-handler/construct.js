import * as _ from "atomic/core";

export function AddedHandler(model, buffer, commandBus){
  this.model = model;
  this.buffer = buffer;
  this.commandBus = commandBus;
}

export const addedHandler = _.constructs(AddedHandler);
