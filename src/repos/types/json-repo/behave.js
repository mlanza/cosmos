import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as repos from "atomic/repos";
import * as ont from "cosmos/ontology";
import * as w from "cosmos/work";
import fetch from "fetch";

function query(self, plan){ //plan is disregarded, must fully load outline.
  return _.fmap(fetch(self.url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
   }),
    function(resp){
      return resp.text();
    },
    JSON.parse,
    _.mapa(function(attrs){
      return make(self, attrs);
    }, _));
}

function make(self, attrs){
  return ont.make(_.get(self.ontology, attrs.$type), attrs);
}

function nextId(){
  return _.uid();
}

function commit(self, workspace){
  const body = _.just(workspace, _.deref, _.mapa(w.serialize, _), function(items){
    return JSON.stringify(items, null, "\t");
  });
  fetch(self.url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  });
}

export default _.does(
  _.implement(ont.IMaker, {make, nextId}),
  _.implement(w.IRepository, {commit}),
  _.implement(repos.IQueryable, {query}));
