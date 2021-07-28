import * as _ from "atomic/core";
import * as imm from "atomic/immutables";
import * as repos from "atomic/repos";
import * as p from "../../protocols/concrete.js";
import {entityWorkspace, c} from "./construct.js";
import {transaction} from "../transaction/construct.js";
import {change} from "../change/construct.js";
import {IEntity} from "../../protocols/ientity/instance.js";
import {IBuffer} from "../../protocols/ibuffer/instance.js";
import {ITransaction} from "../../protocols/itransaction/instance.js";
import {IResolver} from "../../protocols/iresolver/instance.js";
import {buffer as empty} from "../buffer/construct.js";

function query(self, plan){
  return _.filter(function(entity){
    return _.matches(entity.attrs, plan); //TODO temporary
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
            return _.assoc(memo, p.id(entity), entity);
          }, loaded, args),
          changed,
          _.reduce(function(memo, entity){
            return _.conj(memo, p.id(entity));
          }, ids, args)
        ];
      case "update":
        return [
          loaded,
          _.reduce(function(memo, entity){
            return _.assoc(memo, p.id(entity), entity);
          }, changed, args),
          _.reduce(function(memo, entity){
            return _.conj(memo, p.id(entity));
          }, ids, args)
        ];
      case "destroy":
        return [
          loaded,
          _.reduce(function(memo, id){
            return _.assoc(memo, id, null);
          }, changed, args),
          _.reduce(_.conj, ids, args)
        ];
    }
    return [loaded, _changed, ids];
  }, [self.loaded, self.changed, []], txn);
  return entityWorkspace(args[0], args[1], imm.set(args[2]));
}

function load(self, entities){
  return transact(self, [c.load(entities)]);
}

function loaded(self, id){
  return _.contains(self.loaded, id);
}

function update(self, entities){
  return transact(self, [c.update(entities)]);
}

export function updated(self, entity){
  const id = p.id(entity);
  return _.contains(self.loaded, id) && _.contains(self.changed, id);
}

function destroy(self, ids){
  return transact(self, [c.destroy(ids)]);
}

function changes(self){
  return _.count(_.keys(self.changed)) ? transaction(self, context.userId) : null;
}

function changed(self, id){
  return _.contains(self.changed, id);
}

function includes(self, entity){
  return _.contains(self, p.id(entity));
}

function first(self){
  return _.first(vals(self));
}

function rest(self){
  return _.rest(vals(self));
}

function next(self){
  return _.seq(rest(self));
}

function seq(self){
  return _.seq(_.keys(self)) ? self : null;
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
  return _.filter(_.get(self, _),
    imm.distinct(_.concat(Array.from(_.keys(self.loaded)), Array.from(_.keys(self.changed)))));
}

function vals(self){
  return _.map(_.get(self, _), _.keys(self));
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

function commands(self){
  return _.just(self.changed,
    _.keys,
    _.mapcat(function(id){
      const prior   = _.get(self.loaded , id),
            current = _.get(self.changed, id);
      if (prior && current) {
        if (_.eq(prior, current)) {
          return [];
        } else if (prior.constructor !== current.constructor) { //type changed
          return [change(id, prior, null, 'destroy'), change(id, null, current, 'add')];
        } else {
          return [change(id, prior, current, 'modify')];
        }
      } else if (prior) {
        return [change(id, prior, null, 'destroy')];
      } else if (current) {
        return [change(id, null, current, 'add')];
      } else {
        return [];
      }
    }, _));
}

function resolve(self, refs){
  return _.mapa(function(ref){
    return _.detect(function(entity){
      return entity.attrs.Id === ref.value; //TODO inefficient non-indexed access, demeter!
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
  _.implement(IEntity, {id}),
  _.implement(ITransaction, {commands}),
  _.implement(IResolver, {resolve}), //TODO
  _.implement(IBuffer, {load, update, destroy, transact, changes, loaded, changed, touched}),
  _.implement(repos.IQueryable, {query}),
  _.implement(_.IIndexed, {nth}),
  _.implement(_.ICounted, {count}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.IReduce, {reduce}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.INext, {next}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IEmptyableCollection, {empty}));
