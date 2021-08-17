import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import * as imm from "atomic/immutables";
import * as ont from "cosmos/ontology";
import {edge} from "../edge/construct.js";
import {IVertex} from "../../protocols/ivertex/instance.js";
import {ISerializable} from "../../protocols/iserializable/instance.js";
import * as p from "../../protocols/concrete.js";

function outs(self){
  const id = ont.id(self);
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

function attrs1(self){
  return self.attrs;
}

function attrs2(self, attrs){
  return new self.constructor(self.topic, attrs);
}

export const attrs = _.overload(null, attrs1, attrs2);

function meets(self, ...criteria){
  return _.reduce(function(memo, criterion){
    const subject = _.get(criterion, "subject"),
          predicate = _.get(criterion, "predicate"),
          object = _.get(criterion, "object"),
          values = _.get(self, predicate);
      return memo && (subject == null || _.includes(_.get(self, "id"), subject)) && (
        (predicate != null && object != null && _.includes(values, object)) ||
        (predicate != null && object == null && _.contains(self, predicate)) ||
        (predicate == null && object != null && _.detect(_.eq(object, ?), vals(self))));
  }, true, criteria);
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

function contains2(self, key){
  return _.contains(self.attrs, key);
}

function contains3(self, key, value){
  return _.includes(_.get(self.attrs, key), value);
}

const contains = _.overload(null, null, contains2, contains3);

function dissoc(self, key){
  return assoc(self, key, null); //TODO test
}

function keys(self){
  return imm.distinct(_.concat(_.keys(self.topic), _.keys(self.attrs)));
}

function vals(self){
  return _.mapcat(_.get(self, ?), keys(self));
}

function constraints(self){
  return _.reduce(function(memo, key){
    return _.append(memo, vd.optional(key, vd.constraints(fld(self, key))));
  }, vd.and(), keys(self));
}

function serialize(self){
  return self.attrs; //entities keep attributes which can be readily serialized to json
}

function hash(self){
  return imm.hash(self.attrs);
}

export default _.does(
  _.implement(ISerializable, {serialize}),
  _.implement(IVertex, {outs}),
  _.implement(imm.IHash, {hash}),
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.IDeref, {deref: _.identity}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {assoc, contains}),
  _.implement(ont.IEntity, {id, attrs, meets}),
  _.implement(ont.IStruct, {fld}));
