import * as _ from "atomic/core";
import * as repos from "atomic/repos";
import * as p from "../../protocols/concrete.js";
import {IEntity} from "../../protocols/ientity/instance.js";
import {ITransaction} from "../../protocols/itransaction/instance.js";
import {IResolver} from "../../protocols/iresolver/instance.js";
import {IBuffer} from "../../protocols/ibuffer/instance.js";
import {buffer as empty} from "../buffer/construct.js";

// TODO implement indexing

function query(self, plan){
  return repos.query(self.workspace, plan);
}

function load(self, entities){
  return new self.constructor(self.indexes, p.load(self.workspace, entities));
}

function add(self, entities){
  const xs = _.mapcat(p.assertions, entities);
  return new self.constructor(self.indexes, p.add(self.workspace, entities));
}

function edit(self, entities){
  return new self.constructor(self.indexes, p.edit(self.workspace, entities));
}

function destroy(self, entities){
  return new self.constructor(self.indexes, p.destroy(self.workspace, entities));
}

function dissoc(self, id){
  return new self.constructor(self.indexes, _.dissoc(self.workspace, id));
}

export default _.does(
  _.forward("workspace", _.IMap, _.ISeq, _.INext, _.ISeqable, _.ILookup, _.IReduce, _.ICounted, _.IInclusive, _.IAssociative, _.IIndexed, IEntity, ITransaction, IResolver),
  _.implement(repos.IQueryable, {query}),
  _.implement(IBuffer, {load, add, edit, destroy}),
  _.implement(_.IMap, {dissoc}),
  _.implement(_.IEmptyableCollection, {empty}));

