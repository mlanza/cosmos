import * as _ from "atomic/core";

export function Backlinked(entity, workspace, backlinks){
  this.entity = entity;
  this.workspace = workspace;
  this.backlinks = backlinks;
}

export const backlinked = _.pre(_.constructs(Backlinked), _.signature(_.isSome, null, null));
