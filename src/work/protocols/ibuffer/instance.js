import * as _ from "atomic/core";
export const IBuffer = _.protocol({
  repo: null, //the source of the data
  touched: null, //entities touched during the last operation - useful when diffing before/after model snapshots
  load: null, //add existing entity from domain to workspace
  loaded: null,
  add: null, //add new entity to workspace
  edit: null, //update entity present in workspace
  destroy: null, //delete entity present in workspace
  changes: null, //changed entities
  changed: null
});
