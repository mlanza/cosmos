import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import * as p from "../../protocols/concrete.js";
import {IField} from "../../protocols/ifield/instance.js";

function lookup(self, key){
  return self.attrs[key];
}

function assoc(self, key, value){
  return new self.constructor(_.assoc(self.attrs, key, value), self.caster);
}

function contains(self, key){
  return _.contains(self.attrs, key);
}

function aget(self, entity){
  const key = _.get(self, "key");
  return _.just(p.attrs(entity), _.get(_, key), function(value){
    return p.cast(self.caster, value);
  });
}

function aset(self, entity, values){
  const key =  _.get(self, "key"),
        value = p.uncast(self.caster, values),
        attrs = _.isSome(value) ? _.assoc(p.attrs(entity), key, value) : _.dissoc(p.attrs(entity), self.key);
  return p.attrs(entity, attrs);
}

function identifier(self){
  return _.get(self, "key");
}

function constraints(self){
  return vd.constraints(p.cast(self.caster, null));
}

export default _.does(
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {contains, assoc}),
  _.implement(_.IIdentifiable, {identifier}),
  _.implement(IField, {aget, aset}));
