import * as _ from "atomic/core";
import * as imm from "atomic/immutables";
import * as repos from "atomic/repos";
import * as ont from "cosmos/ontology";
import * as p from "../../protocols/concrete.js";
import {entityWorkspace, c} from "./construct.js";
import {IBuffer} from "../../protocols/ibuffer/instance.js";
import {IResolver} from "../../protocols/iresolver/instance.js";
import {buffer as empty} from "../buffer/construct.js";

function query(self, plan){
  return _.filter(function(entity){
    return _.matches(entity.attrs, plan); //TODO temporary
  }, _.seq(self));
}

function search(self, criteria){
  return _.filter(function(entity){
    return _.reduce(function(memo, criterion){
      return memo && w.meets(entity, criterion);
    }, true, criteria);
  }, _.seq(self));
}

function transact(self, txn){
  const args = _.reduce(function([loaded, changed, ids], cmd){
    const type = _.identifier(cmd),
          args = _.get(cmd, "args");
    switch(type) {
      case "load":
        return [
          _.reduce(function(memo, entity){
            return _.assoc(memo, ont.id(entity), entity);
          }, loaded, args),
          changed,
          _.reduce(function(memo, entity){
            return _.conj(memo, ont.id(entity));
          }, ids, args)
        ];
      case "update":
        return [
          loaded,
          _.reduce(function(memo, entity){
            return _.assoc(memo, ont.id(entity), entity);
          }, changed, args),
          _.reduce(function(memo, entity){
            return _.conj(memo, ont.id(entity));
          }, ids, args)
        ];
      case "destroy":
        return [
          loaded,
          _.reduce(_.assoc(?, id, null), changed, args),
          _.reduce(_.conj, ids, args)
        ];
    }
    return [loaded, changed, ids];
  }, [self.loaded, self.changed, []], txn);
  return entityWorkspace(args[0], args[1], imm.set(args[2]));
}

function load(self, ...entities){
  return transact(self, [c.load(entities)]);
}

function update(self, ...entities){
  return transact(self, [c.update(entities)]);
}

function destroy(self, ...ids){
  return transact(self, [c.destroy(ids)]);
}

function change(self, id){
  const current = _.get(self, id),
        prior = _.get(self.loaded, id);
  return current === prior ? null : [current, prior];
}

function changes(self){
  return self.changed |> _.keys |> _.map(change(self, ?), ?) |> _.compact;
}

function includes(self, entity){
  return _.contains(self, ont.id(entity));
}

function lookup(self, id){
  return _.contains(self.changed, id) ? _.get(self.changed, id) : _.get(self.loaded, id);
}

function reduce(self, f, init){
  return _.reduce(f, init, _.map(_.get(self, _), _.keys(self)));
}

function dissoc(self, id){
  return _.contains(self, id) ?
    entityWorkspace(
      _.contains(self.loaded, id) ? _.dissoc(self.loaded, id) : self.loaded,
      _.contains(self.changed, id) ? _.dissoc(self.changed, id) : self.changed, _.cons(id)) : self;
}

function keys(self){
  return _.filter(_.get(self, _), imm.distinct(_.concat(_.keys(self.loaded), _.keys(self.changed))));
}

function vals(self){
  const keys = _.keys(self);
  return _.seq(keys) ? _.map(_.get(self, ?), keys) : null;
}

function count(self){
  return _.count(keys(self));
}

function contains(self, id){
  return !!_.get(self, id);
}

function id(self){
  return self.id;
}

function resolve(self, refs){
  return _.mapa(function(ref){
    return _.detect(function(entity){
      return entity.attrs.id === ref.value; //TODO inefficient non-indexed access, demeter!
    }, self);
  }, refs);
}

function touched(self){
  return self.touched;
}

function nth(self, idx){
  return _.first(_.drop(idx, self));
}

export default _.does(
  _.implement(IResolver, {resolve}), //TODO
  _.implement(IBuffer, {load, update, destroy, transact, change, changes, touched}),
  _.implement(repos.IQueryable, {query}),
  _.implement(ont.IEntity, {id}),
  _.implement(ont.ICatalogue, {search}),
  _.implement(_.IIndexed, {nth}),
  _.implement(_.ICounted, {count}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.IReduce, {reduce}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.ISeqable, {seq: vals}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IEmptyableCollection, {empty}));
