import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import * as p from "./protocols/concrete.js";
import * as T from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";

export function reassign(self, key, f){
  const field = p.fld(self, key),
        values = p.aget(field, self),
        revised = f(values);
  return revised === values ? self : p.aset(field, self, _.into(_.empty(values), revised));
}

function assert3(self, key, value){
  return reassign(self, key, _.conj(_, value));
}

export const assert = _.overload(null, null, null, assert3, _.reducing(assert3));

function retract3(self, key, value){
  return reassign(self, key, _.branch(_.includes(_, value), _.unconj(_, value), _.identity));
}

function retract2(self, key){
  return reassign(self, key, _.branch(_.seq, _.empty, _.identity));
}

export const retract = _.overload(null, null, retract2, retract3, _.reducing(retract3));

function asserts3(self, key, value){
  return _.seq(_.filter(function(edge){
    return _.equiv(value, _.nth(edge, 1));
  }, asserts2(self, key)));
}

function asserts2(self, key){
  return p.aget(p.fld(self, key), self);
}

function asserts1(self){
  return _.seq(_.mapcat(function(key){
    return asserts2(self, key);
  }, _.keys(self)));
}

export const asserts = _.overload(null, asserts1, asserts2, asserts3);
export const unlimited = T.constrainedCollection(vd.and(vd.unlimited));
export function entities(ID){
  return vd.constrain(unlimited, vd.collOf(vd.isa(ID)));
}
export function entity(ID){
  return vd.constrain(T.required, vd.collOf(vd.isa(ID)));
}
