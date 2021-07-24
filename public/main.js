define(['fetch', 'atomic/core', 'atomic/dom', 'atomic/transducers', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'atomic/repos', 'cosmos/ontology', 'cosmos/shell', 'cosmos/work', 'cosmos/tiddology', 'cosmos/editor', 'context'], function(fetch, _, dom, t, mut, $, vd, imm, repos, ont, sh, w, tidd, ed, context){

  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var IOriginated = _.protocol({
    origin: null
  });

  var IView = _.protocol({ //TODO rename to mount
    render: null
  });

  var protocols = {
    IOriginated: IOriginated,
    IView: IView
  }

  function dirtyKeys(self, other){
    return self.attrs === other.attrs ? null : _.remove(function(key){
      return self.attrs[key] === other.attrs[key];
    }, imm.distinct(_.concat(_.keys(self.attrs), _.keys(other.attrs))));
  }

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

  function Cursor(source){
    this.source = source;
  }

  function deref(self){
    return _.just(self.source, _.deref, _.deref);
  }

  function swap(self, f){
    _.swap(self.source, _.fmap(_, f));
  }

  var cursor = _.constructs(Cursor);

  _.doto(Cursor,
    _.implement(_.IDeref, {deref: deref}),
    _.implement(_.ISwap, {swap: swap}));

  //NOTE a view is capable of returning a seq of all possible `IView.interactions` each implementing `IIdentifiable` and `INamable`.
  //NOTE an interaction is a persistent, validatable object with field schema.  It will be flagged as command or query which will help with processing esp. pipelining.  When successfully validated it has all that it needs to be handled by the handler.  That it can be introspected allows for the UI to help will completing them.
  function Outline(repo, buffer, model, commandBus, eventBus, emitter, options){
    this.repo = repo;
    this.buffer = buffer;
    this.model = model;
    this.commandBus = commandBus;
    this.eventBus = eventBus;
    this.emitter = emitter;
    this.options = options;
  }

  function outline(repo, options){
    var $state = $.cell(_.journal({
          buffer: w.buffer(repo),
          effects: [],
          root: options.root, //identify the root entities from where rendering begins
          selected: _.into(imm.set(), options.selected || []), //track which entities are selected
          expanded: _.into(imm.set(), options.expanded || []) //track which entities are expanded vs collapsed
        })),
        model = cursor($state),
        events = $.events(),
        commandBus = sh.bus(),
        eventBus = sh.bus(),
        emitter = $.subject(),
        buffer = $.cursor(model, ["buffer"]),
        effects = $.cursor(model, ["effects"]);

    var entityDriven = _.comp(_.includes(["assert", "retract", "toggle", "destroy", "cast", "tag", "untag", "select", "deselect"], _), _.identifier);

    function compile(event){
      var args = _.get(event, "args")
      switch (event.type) { //TODO install via map?
        case "took":
          return t.take(_.first(args));
        case "skipped":
          return t.drop(_.first(args));
        case "lasted":
          return t.last(_.first(args));
        case "found":
          switch (_.count(args)) {
            case 1:
              var type = _.first(args);
              return t.filter(function(entity){
                return _.first(_.get(entity, "$type")) == type;
              });
            case 2:
              var key = _.first(args), value = _.second(args);
              return t.filter(function(entity){
                return _.includes(_.get(entity, key), value);
              });
          }
      }
    }

    _.doto(commandBus,
      mut.conj(_,
        sh.lockingMiddleware(commandBus),
        ed.keyedMiddleware("command-id", _.generate(_.iterate(_.inc, 1))),
        ed.findMiddleware(effects, compile, buffer, entityDriven),
        ed.selectionMiddleware(model, entityDriven),
        sh.teeMiddleware(_.see("command")),
        _.doto(sh.handlerMiddleware(),
          mut.assoc(_, "pipe", ed.pipeHandler(buffer, model, commandBus)),
          mut.assoc(_, "find", ed.effectHandler(events, "found")),
          mut.assoc(_, "take", ed.effectHandler(events, "took")),
          mut.assoc(_, "skip", ed.effectHandler(events, "skipped")),
          mut.assoc(_, "last", ed.effectHandler(events, "lasted")),
          mut.assoc(_, "peek", ed.peekHandler(events)),
          mut.assoc(_, "load", ed.loadHandler(buffer, events)),
          mut.assoc(_, "add", ed.addHandler(buffer, events)),
          mut.assoc(_, "save", ed.saveHandler(buffer, events)),
          mut.assoc(_, "undo", ed.undoHandler($state, events)),
          mut.assoc(_, "redo", ed.redoHandler($state, events)),
          mut.assoc(_, "flush", ed.flushHandler($state, events)),
          mut.assoc(_, "cast", ed.castHandler(buffer, events)),
          mut.assoc(_, "tag", ed.tagHandler(commandBus)),
          mut.assoc(_, "untag", ed.untagHandler(commandBus)),
          mut.assoc(_, "toggle", ed.toggleHandler(buffer, events)),
          mut.assoc(_, "assert", ed.assertHandler(buffer, events)),
          mut.assoc(_, "retract", ed.retractHandler(buffer, events)),
          mut.assoc(_, "destroy", ed.destroyHandler(buffer, events)),
          mut.assoc(_, "query", ed.queryHandler(buffer, events)),
          mut.assoc(_, "select", ed.selectHandler(buffer, events)),
          mut.assoc(_, "deselect", ed.deselectHandler(model, events))),
        sh.drainEventsMiddleware(events, eventBus)));

    _.doto(eventBus,
      mut.conj(_,
        ed.keyedMiddleware("event-id", _.generate(_.iterate(_.inc, 1))),
        sh.teeMiddleware(_.see("event")),
        _.doto(sh.handlerMiddleware(),
          mut.assoc(_, "peeked", ed.peekedHandler(buffer, model)),
          mut.assoc(_, "found", ed.effectedHandler(effects)),
          mut.assoc(_, "took", ed.effectedHandler(effects)),
          mut.assoc(_, "skipped", ed.effectedHandler(effects)),
          mut.assoc(_, "lasted", ed.effectedHandler(effects)),
          mut.assoc(_, "loaded", ed.loadedHandler(buffer)),
          mut.assoc(_, "added", ed.addedHandler(model, buffer, commandBus)),
          mut.assoc(_, "saved", ed.savedHandler(commandBus)),
          mut.assoc(_, "undone", ed.undoneHandler($state)),
          mut.assoc(_, "redone", ed.redoneHandler($state)),
          mut.assoc(_, "flushed", ed.flushedHandler($state)),
          mut.assoc(_, "toggled", ed.toggledHandler(buffer)),
          mut.assoc(_, "asserted", ed.assertedHandler(buffer)),
          mut.assoc(_, "retracted", ed.retractedHandler(buffer)),
          mut.assoc(_, "destroyed", ed.destroyedHandler(buffer)),
          mut.assoc(_, "queried", ed.queriedHandler(commandBus)),
          mut.assoc(_, "selected", ed.selectedHandler(model)),
          mut.assoc(_, "deselected", ed.deselectedHandler(model))),
        sh.eventMiddleware(emitter)));

    return new Outline(repo, buffer, model, commandBus, eventBus, emitter, options);
  }

  (function(){
    function render(self, el){ //TODO implement last
      _.log("render", self, el);
    }

    function dispatch(self, message){
      $.dispatch(self.commandBus, message);
    }

    function lookup(self, guid){ //TODO drop — for development purposes
      return _.get(self.buffer, guid);
    }

    function sub(self, observer){ //TODO provide separate set of external events (e.g. don't expose its internals)
      return $.sub(self.emitter, observer);
    }

    return _.doto(Outline,
      _.implement(_.ILookup, {lookup: lookup}),
      _.implement($.IDispatch, {dispatch: dispatch}),
      _.implement($.ISubscribe, {sub: sub}),
      _.implement(IView, {render: render}));

  })();


  var ol = _.doto(
    outline(
      jsonResource("../data/outline.json", tidd.tiddology),
      {root: null}),
    $.sub(_,
      t.filter(function(e){
        return e.type === "loaded";
      }),
      function(e){
        _.each($.dispatch(ol, _), [
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

  return _.just(protocols,
    _.reduce(_.merge, _,
      _.map(function(protocol){
        return _.reduce(function(memo, key){
          return _.assoc(memo, key, protocol[key]);
        }, {}, Object.keys(protocol));
      }, _.vals(protocols))),
    _.merge(_, {
      ol: ol,
      c: c,
      dirtyKeys: dirtyKeys,
      domain: domain
    }), _.impart(_, _.partly));

});
