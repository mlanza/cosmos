import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as repos from "atomic/repos";
import * as ont from "cosmos/ontology";
import * as p from "../../protocols/concrete.js";
import {buffer} from "./construct.js";
import {IBuffer} from "../../protocols/ibuffer/instance.js";
import {IPersistable} from "../../protocols/ipersistable/instance.js";

function make(self, attrs){
  return ont.make(self.repo, attrs);
}

function edit(self, entities){
  return fmap(self, p.edit(?, entities));
}

function lookup(self, id){
  return _.just(self.workspace, _.deref, _.get(_, id));
}

function contains(self, id){
  return _.just(self.workspace, _.deref, _.contains(_, id));
}

function load(self, entities){
  return fmap(self, p.load(?, entities));
}

function query(self, plan){
  return repos.query(self.repo, plan);
}

function save(self){
  return p.commit(self.repo, self.workspace); //TODO return outcome status?
}

function fmap(self, f){
  return buffer(self.repo, f(self.workspace));
}

export default _.does(
  _.forward("workspace", _.IReduce, _.IRevertible),
  _.implement(IPersistable, {save}), //TODO
  _.implement(IBuffer, {load, edit}), //TODO ITransientBuffer.load
  _.implement(_.IFunctor, {fmap}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.ILookup, {lookup}),
  _.implement(ont.IMaker, {make}),
  _.implement(repos.IQueryable, {query}));
