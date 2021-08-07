import * as _ from "atomic/core";
import * as imm from "atomic/immutables";
import {entityWorkspace} from "../entity-workspace/construct.js";

export function IndexedEntityWorkspace(librarian, indexes, workspace){
  this.librarian = librarian;
  this.indexes = indexes;
  this.workspace = workspace;
}

export const indexedEntityWorkspace = _.fnil(_.constructs(IndexedEntityWorkspace), null, imm.map(), entityWorkspace());
