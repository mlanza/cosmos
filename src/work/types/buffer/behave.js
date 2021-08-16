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

function query(self, plan){
  return repos.query(self.repo, plan);
}

function load(self, ...entities){
  return fmap(self, p.load(?, ...entities));
}

function update(self, ...entities){
  return fmap(self, p.update(?, ...entities));
}

function destroy(self, ...ids){
  return fmap(self, p.destroy(?, ...ids));
}

function transact(self, commands){
  return fmap(self, p.transact(?, commands));
}

function change(self, id){
  return p.change(self.workspace, id);
}

function changes(self){
  return p.changes(self.workspace);
}

function lookup(self, id){
  return _.just(self.workspace, _.get(_, id));
}

function contains(self, id){
  return _.just(self.workspace, _.contains(_, id));
}

function repo(self){
  return self.repo;
}

function fmap(self, f){
  return buffer(self.repo, f(self.workspace));
}

export default _.does(
  _.forward("workspace", _.IReduce, ont.ICatalogue),
  _.implement(IBuffer, {load, update, destroy, transact, changes, change, repo}),
  _.implement(_.IFunctor, {fmap}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.ILookup, {lookup}),
  _.implement(ont.IMaker, {make}),
  _.implement(repos.IQueryable, {query}));
