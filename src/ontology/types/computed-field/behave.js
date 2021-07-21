import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import {IField} from "../../protocols/ifield/instance.js";

function lookup(self, key){
  return self.attrs[key];
}

function assoc(self, key, value){
  return new self.constructor(_.assoc(self.attrs, key, value), self.computations, self.emptyColl);
}

function contains(self, key){
  return _.contains(self.attrs, key);
}

function aget(self, entity){
  return _.into(self.emptyColl, _.filter(_.isSome, _.map(_.applying(entity), self.computations)));
}

function identifier(self){
  return _.get(self, "key");
}

function constraints(self){
  return vd.constraints(self.emptyColl);
}

export default _.does(
  _.implement(vd.IConstrainable, {constraints}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {contains, assoc}),
  _.implement(_.IIdentifiable, {identifier}),
  _.implement(IField, {aget}));
