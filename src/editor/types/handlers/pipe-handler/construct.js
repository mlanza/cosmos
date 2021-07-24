import * as _ from "atomic/core";

export function PipeHandler(ids, buffer, model, commandBus){
  this.ids = ids;
  this.buffer = buffer;
  this.model = model;
  this.commandBus = commandBus;
}

export const pipeHandler = _.constructs(PipeHandler);
