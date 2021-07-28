import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as imm from "atomic/immutables";

export function EntityWorkspace(loaded, changed, touched){
  this.loaded = loaded;
  this.changed = changed;
  this.touched = touched;
}

export const entityWorkspace = _.fnil(_.constructs(EntityWorkspace), imm.map(), imm.map(), imm.set());
export const c = sh.defs(sh.command, ["load", "update", "destroy"]);
