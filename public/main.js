define(['fetch', 'atomic/core', 'atomic/dom', 'atomic/transducers', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'atomic/repos', 'cosmos/ontology', 'cosmos/shell', 'cosmos/work', 'cosmos/tiddology', 'cosmos/editor', 'context'], function(fetch, _, dom, t, mut, $, vd, imm, repos, ont, sh, w, tidd, ed, context){

  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var IOriginated = _.protocol({
    origin: null
  });

  function JsonResource(url, ontology) {
    this.url = url;
    this.ontology = ontology;
  }

  var jsonResource = _.constructs(JsonResource);

  (function(){

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

    function commit(self, workspace){
      var body = _.just(workspace, _.deref, _.mapa(w.serialize, _), function(items){
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
    _.doto(JsonResource,
      _.implement(ont.IMaker, {make: make}),
      _.implement(w.IRepository, {commit: commit}),
      _.implement(repos.IQueryable, {query: query}));

  })();

  function Domain(repos){
    this.repos = repos;
  }

  function domain(repos){
    return _.reduce(_.conj, new Domain({}), repos || []);
  }

  (function(){

    function origin(self, txn){
      var entity = _.deref(txn);
      return _.detect(function(repo){
        return repo.type === entity.type ? repo : null;
      }, _.vals(self.repos));
    }

    function query(self, options){
      var type = _.get(options, "$type"),
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

    _.doto(Domain,
      _.implement(w.IResolver, {resolve: resolve}),
      _.implement(_.ICollection, {conj: conj}),
      _.implement(_.IEmptyableCollection, {empty: _.constantly(domain())}),
      _.implement(IOriginated, {origin: origin}),
      _.implement(ont.IMaker, {make: make}),
      _.implement(repos.IQueryable, {query: query}));

  })();

  var c = ed.commands;

  var editor = _.doto(
    ed.editor(
      jsonResource("../data/outline.json", tidd.tiddology),
      {root: null}),
    $.sub(_,
      t.filter(function(e){
        return e.type === "loaded";
      }),
      function(e){
        _.each($.dispatch(editor, _), [
          c.pipe([
            c.find(["tiddler"]),
            c.last([5]),
            c.select(),
            c.peek()
          ]),
          c.select([], {id: [_.guid(0)]}),
          c.tag(["test"], {id: [_.guid(1)]}),
          c.tag(["cosmos"]),
          c.pipe([
            c.add(["tiddler", "Scooby"]),
            c.select(),
            c.tag(["sleuth"]),
            c.tag(["dog"]),
          ]),
          c.select([], {id: [_.guid(0), _.guid(1)]}),
          c.peek()
        ]);
      }),
    $.dispatch(_, c.query()));

  return {
    editor: editor,
    c: c
  }

});
