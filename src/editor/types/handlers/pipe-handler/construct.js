import * as _ from "atomic/core";

export function PipeHandler(buffer, model, commandBus){
  this.buffer = buffer;
  this.model = model;
  this.commandBus = commandBus;
}

export const pipeHandler = _.constructs(PipeHandler);
