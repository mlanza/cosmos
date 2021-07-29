import * as _ from "atomic/core";
export const IBuffer = _.protocol({
  repo: null, //the source of the data
  touched: null, //entities touched during the last operation - useful when diffing before/after model snapshots
  load: null, //add existing entity from domain to workspace
  update: null, //add new or modified entity to workspace
  destroy: null, //delete entity present in workspace
  transact: null, //update via transaction, potentially a protocol of its own
  loaded: null, //was id loaded?
  change: null, //change to entity
  changes: null, //changed entities
  changed: null //was id changed?
});
