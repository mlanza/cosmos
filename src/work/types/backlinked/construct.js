import * as _ from "atomic/core";

export function Backlinked(entity, workspace, indexes){
  this.entity = entity;
  this.workspace = workspace;
  this.indexes = indexes;
}

export const backlinked = _.pre(_.constructs(Backlinked), _.signature(_.isSome, null, null));
