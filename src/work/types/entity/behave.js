import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import * as imm from "atomic/immutables";
import * as ont from "cosmos/ontology";
import {edge} from "../edge/construct.js";
import {IEntity} from "../../protocols/ientity/instance.js";
import {IVertex} from "../../protocols/ivertex/instance.js";
import {ISerializable} from "../../protocols/iserializable/instance.js";
import * as p from "../../protocols/concrete.js";

function outs(self){
  const id = p.id(self);
  return _.mapcat(function(key){
    const field = ont.fld(self, key);
    return _.get(field, "computed") ? [] : _.map(function(value){
      return edge(id, key, value);
    }, _.get(self, key));
  }, _.filter(_.notEq(_, "id"), _.keys(self))); //TODO identify pk with metadata
}

function id(self){
  return _.uid(self.attrs.id);
}

function fld(self, key){
  return ont.fld(self.topic, key) || _.assoc(_.isArray(_.get(self.attrs, key))
    ? ont.field(key, ont.unlimited, ont.valuesCaster)
    : ont.field(key, ont.optional, ont.valueCaster), "missing", true);
}

function lookup(self, key){
  return ont.aget(fld(self, key), self);
}

function assoc(self, key, values){
  return ont.aset(fld(self, key), self, values);
}

function contains(self, key){
  return _.contains(self.attrs, key);
}

function dissoc(self, key){
  return assoc(self, key, null); //TODO test
}

function keys(self){
  return imm.distinct(_.concat(_.keys(self.topic), _.keys(self.attrs)));
}

function constraints(self){
  return _.reduce(function(memo, key){
    return _.append(memo, vd.optional(key, vd.constraints(fld(self, key))));
  }, vd.and(), keys(self));
}

function serialize(self){
  return self.attrs;
}

export default _.does(
  _.implement(IEntity, {id}),
  _.implement(ISerializable, {serialize}),
  _.implement(IVertex, {outs}),
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.IMap, {keys, dissoc}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {assoc, contains}),
  _.implement(ont.IStruct, {fld}));
