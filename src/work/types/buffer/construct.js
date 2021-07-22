import * as _ from "atomic/core";

export function Buffer(repo, workspace){
  this.repo = repo;
  this.workspace = workspace;
}

export const buffer = _.constructs(Buffer);
