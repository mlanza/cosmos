import * as _ from "atomic/core";
export const IBuffer = _.protocol({
  touched: null, //entities touched during the last operation - useful when diffing before/after model snapshots
  dirty: null, //was a given entity ever modified?
  load: null, //add existing entity from domain to workspace
  add: null, //add new entity to workspace
  edit: null, //update entity present in workspace
  destroy: null, //delete entity present in workspace
  changes: null //changed entities
});
