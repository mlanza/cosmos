import * as _ from "atomic/core";

export function FindMiddleware(effects, find, buffer, pred, lastPipeId){
  this.effects = effects;
  this.find = find;
  this.buffer = buffer;
  this.pred = pred;
  this.lastPipeId = lastPipeId;
}

export const findMiddleware = _.constructs(FindMiddleware);
