import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import * as imm from "atomic/immutables";
import * as ont from "cosmos/ontology";
import {edge} from "../edge/construct.js";
import {IVertex} from "../../protocols/ivertex/instance.js";
import {ISerializable} from "../../protocols/iserializable/instance.js";
import * as p from "../../protocols/concrete.js";

function equiv(self, other){
  return other != null && self.entity === other.entity && self.backlinks === other.backlinks && _.reduce(function(memo, id){
    return memo && (_.get(self.workspace, id) === _.get(other.workspace, id));
  }, true, self.backlinks);
}

function ins(self){
  const id = ont.id(self.entity);
  return _.just(self.backlinks, _.mapcat(function(id){
    return p.outs(_.get(self.workspace, id))
  }, ?), _.filter(function(edge){
    return _.eq(id, _.get(edge, "object"));
  }, ?));
}

function outs(self){
  return p.outs(self.entity);
}

function id(self){
  return ont.id(self.entity);
}

function attrs1(self){
  return ont.attrs(self.entity);
}

function attrs2(self, attrs){
  return new self.constructor(ont.attrs(self.entity, attrs), self.backlinks);
}

export const attrs = _.overload(null, attrs1, attrs2);

function meets(self, ...criteria){
  return ont.meets(self.entity, ...criteria);
}

function deref(self){
  return self.entity;
}

function fld(self, key){
  return ont.fld(self.entity, key);
}

function lookup(self, key){
  return _.get(self.entity, key);
}

function assoc(self, key, values){
  return _.assoc(self.entity, key, values);
}

function contains2(self, key){
  return _.contains(self.entity, key);
}

function contains3(self, key, value){
  return _.contains(self.entity, key, value);
}

const contains = _.overload(null, null, contains2, contains3);

function dissoc(self, key){
  return _.assoc(self.entity, key, null);
}

function keys(self){
  return _.keys(self.entity);
}

function vals(self){
  return _.vals(self.entity);
}

function constraints(self){
  return vd.constraints(self.entity);
}

function serialize(self){
  return p.serialize(self.entity);
}

function hash(self){
  return imm.hash([self.entity, self.backlinks]);
}

export default _.does(
  _.implement(ISerializable, {serialize}),
  _.implement(IVertex, {ins, outs}),
  _.implement(imm.IHash, {hash}),
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.IEquiv, {equiv}),
  _.implement(_.IDeref, {deref}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {assoc, contains}),
  _.implement(ont.IEntity, {id, attrs, meets}),
  _.implement(ont.IStruct, {fld}));
