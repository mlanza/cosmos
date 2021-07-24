import * as _ from "atomic/core";
import * as repos from "atomic/repos";
import * as w from "cosmos/work";
import * as ont from "cosmos/ontology";
import {domain} from "./construct.js";
import {IOriginated} from "../../protocols/ioriginated/instance.js";

function origin(self, txn){
  const entity = _.deref(txn);
  return _.detect(function(repo){
    return repo.type === entity.type ? repo : null;
  }, _.vals(self.repos));
}

function query(self, options){
  const type = _.get(options, "$type"),
        plan = _.dissoc(options, "$type");
  return repos.query(_.get(self.repos, type), plan);
}

function make(self, attrs){
  return ont.make(_.get(self.repos, _.get(attrs, "$type")) || _.just(self.repos, _.keys, _.first, _.get(self.repos, _)), _.dissoc(attrs, "$type"));
}

function conj(self, repo){
  return new Domain(_.assoc(self.repos, _.identifier(repo), repo));
}

function resolve(self, refs){ //TODO implement
}

export default _.does(
  _.implement(_.ICollection, {conj}),
  _.implement(_.IEmptyableCollection, {empty: _.constantly(domain())}),
  _.implement(w.IResolver, {resolve}),
  _.implement(ont.IMaker, {make}),
  _.implement(repos.IQueryable, {query}),
  _.implement(IOriginated, {origin}));
