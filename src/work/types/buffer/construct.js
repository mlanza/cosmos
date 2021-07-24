import * as _ from "atomic/core";
import {entityWorkspace} from "../entity-workspace/construct.js";
export function Buffer(repo, workspace){
  this.repo = repo;
  this.workspace = workspace;
}

export function buffer(repo, workspace){
  return new Buffer(repo, workspace || entityWorkspace());
}
