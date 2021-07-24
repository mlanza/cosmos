import * as _ from "atomic/core";

export function FindMiddleware(effects, compile, buffer, pred, lastPipeId){
  this.effects = effects;
  this.compile = compile;
  this.buffer = buffer;
  this.pred = pred;
  this.lastPipeId = lastPipeId;
}

export const findMiddleware = _.constructs(FindMiddleware);
