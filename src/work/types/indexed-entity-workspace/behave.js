import * as _ from "atomic/core";
import * as imm from "atomic/immutables";
import * as repos from "atomic/repos";
import * as ont from "cosmos/ontology";
import * as p from "../../protocols/concrete.js";
import {IEntity} from "../../protocols/ientity/instance.js";
import {IResolver} from "../../protocols/iresolver/instance.js";
import {IBuffer} from "../../protocols/ibuffer/instance.js";
import {buffer as empty} from "../buffer/construct.js";

//TODO utilize indices for finding - indices may be approximations so results must still be filtered
//TODO provide backlinks (`ins`) on entities

function search(self, criteria){
  const sets = _.just(criteria, _.mapcat(function(criterion){
    return ont.indices(self.librarian, criterion);
  }, ?), _.mapa(function(criterion){
    return _.get(self.indexes, criterion);
  }, ?));
  const init = _.first(sets),
        rest = _.rest(sets),
        ids = _.reduce(_.intersection, init, rest);
  if (_.count(ids)) {
    _.log("index hits", criteria, ids);
    return _.filter(function(entity){
      return w.meets(entity, ...criteria);
    }, _.map(_.get(self, ?), ids));
  } else {
    return ont.search(self.workspace, criteria);
  }
}

function diff(current, former){
  const c = imm.set(p.outs(current)),
        f = imm.set(p.outs(former)),
        added = _.difference(c, f),
        removed = _.difference(f, c);
  return [added, removed];
}

function revisions(current, former, librarian, ids){
  return _.map(function(id){
    return diff(_.get(current, id), _.get(former, id))
      |> _.map(function(edges){
          return _.count(edges) ? _.apply(ont.indices, librarian, edges) : [];
        }, ?)
      |> _.cons(id, ?)
      |> _.toArray //allow destructuring
  }, ids);
}

const reindex = _.reduce(function(memo, [id, added, removed]){
  return _.just(memo,
    _.reduce(function(memo, index){
      const entities = _.maybe(memo, _.get(?, index), _.conj(_, id)) || imm.set([id]);
      return _.assoc(memo, index, entities);
    }, ?, added),
    _.reduce(function(memo, index){
      const entities = _.just(memo, _.get(?, index), _.disj(_, id));
      if (_.count(entities)) {
        return _.assoc(memo, index, entities);
      } else {
        return _.dissoc(memo, index);
      }
    }, ?, removed));
}, ?, ?);

function reindexing(current, former, librarian, indexes){
  return current
    |> p.touched
    |> revisions(current, former, librarian, ?)
    |> reindex(indexes, ?);
}

function fmap(self, f){
  const current = f(self.workspace);
  return new self.constructor(self.librarian, reindexing(current, self.workspace, self.librarian, self.indexes), current);
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

function dissoc(self, id){ //TODO
  return new self.constructor(self.librarian, self.indexes, _.dissoc(self.workspace, id));
}

function query(self, plan){
  return repos.query(self.workspace, plan);
}

export default _.does(
  _.forward("workspace", _.IMap, _.ISeqable, _.ILookup, _.IReduce, _.ICounted, _.IInclusive, _.IAssociative, _.IIndexed, IEntity, IResolver),
  _.implement(repos.IQueryable, {query}),
  _.implement(ont.ICatalogue, {search}),
  _.implement(IBuffer, {load, update, destroy, transact}),
  _.implement(_.IFunctor, {fmap}),
  _.implement(_.IMap, {dissoc}),
  _.implement(_.IEmptyableCollection, {empty}));

