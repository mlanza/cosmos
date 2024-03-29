import * as _ from "atomic/core";
import {IStruct} from "../../protocols/istruct/instance.js";
import {IMaker} from "../../protocols/imaker/instance.js";

function lookup(self, key){
  return _.get(self.attrs, key);
}

function assoc(self, key, value){
  return new self.constructor(self.type, _.assoc(self.attrs, key, value), self.struct, self.resource);
}

function contains(self, key){
  return _.contains(self.attrs, key);
}

function make(self, attrs){
  return new self.type(self, attrs);
}

function name(self){
  return _.get(self, "label");
}

function identifier(self){
  return _.get(self, "key");
}

function fld(self, key){
  return _.get(self.struct, key);
}

function keys(self){
  return _.keys(self.struct);
}

export default _.does(
  _.implement(IStruct, {fld}),
  _.implement(IMaker, {make}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {assoc, contains}),
  _.implement(_.INamable, {name}),
  _.implement(_.IIdentifiable, {identifier}),
  _.implement(_.IMap, {keys}));
