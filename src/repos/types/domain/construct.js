import * as _ from "atomic/core";

export function Domain(repos){
  this.repos = repos;
}

export function domain(repos){
  return _.reduce(_.conj, new Domain({}), repos || []);
}
