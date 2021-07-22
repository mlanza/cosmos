import * as _ from "atomic/core";
import {assertionStore} from "../assertion-store/construct.js";
import {entityWorkspace} from "../entity-workspace/construct.js";

export function IndexedEntityWorkspace(indexes, workspace){
  this.indexes = indexes;
  this.workspace = workspace;
}

export const indexedEntityWorkspace = _.fnil(_.constructs(IndexedEntityWorkspace), assertionStore(), entityWorkspace());
