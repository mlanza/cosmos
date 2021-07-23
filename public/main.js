define(['fetch', 'atomic/core', 'atomic/dom', 'atomic/transducers', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'atomic/repos', 'cosmos/ontology', 'cosmos/shell', 'cosmos/work', 'cosmos/tiddology', 'context'], function(fetch, _, dom, t, mut, $, vd, imm, repos, ont, sh, w, tidd, context){

  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var IAssociative = _.IAssociative,
      ISwap = _.ISwap,
      IMergable = _.IMergable,
      IHash = imm.IHash,
      ISet = _.ISet,
      INamable = _.INamable,
      ITransientAssociative = mut.ITransientAssociative,
      IDispatch = $.IDispatch,
      ISubscribe = $.ISubscribe,
      IRevertible = _.IRevertible,
      IEmptyableCollection = _.IEmptyableCollection,
      ICheckable = vd.ICheckable,
      IConstrainable = vd.IConstrainable,
      ICollection = _.ICollection,
      ITransientCollection = mut.ITransientCollection,
      IMiddleware = $.IMiddleware,
      IReduce = _.IReduce,
      IKVReduce = _.IKVReduce,
      IAppendable = _.IAppendable,
      IPrependable = _.IPrependable,
      INext = _.INext,
      ISeq = _.ISeq,
      IDeref = _.IDeref,
      IEquiv = _.IEquiv,
      IIndexed = _.IIndexed,
      ICounted = _.ICounted,
      ISeqable = _.ISeqable,
      IMap = _.IMap,
      ILookup = _.ILookup,
      IBounds = _.IBounds,
      IFunctor = _.IFunctor,
      IInclusive = _.IInclusive;

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
      _.implement(ICollection, {conj: conj}),
      _.implement(IEmptyableCollection, {empty: _.constantly(domain())}),
      _.implement(IOriginated, {origin: origin}),
      _.implement(ont.IMaker, {make: make}),
      _.implement(repos.IQueryable, {query: query}));

  })();

  var c = sh.defs(sh.command, ["pipe", "find", "take", "skip", "last", "query", "load", "save", "cast", "toggle", "tag", "untag", "assert", "retract", "select", "deselect", "add", "destroy", "undo", "redo", "flush", "peek"]),
      e = sh.defs(sh.event, ["found", "took", "skipped", "lasted", "queried", "loaded", "saved", "casted", "toggled", "tagged", "untagged", "asserted", "retracted", "selected", "deselected", "added", "destroyed", "undone", "redone", "flushed", "peeked"]);

  function handleExisting(event){
    return function handle(self, command, next){
      var e = Object.assign(event(), command, {type: event().type});
      //var id = _.get(command, "id");
      //if (_.apply(_.everyPred, _.contains(self.buffer, _), id)) {
        $.raise(self.provider, e);
      //}
      next(command);
    }
  }

  function FindHandler(provider){
    this.provider = provider;
  }

  var findHandler = _.constructs(FindHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, sh.effect(command, "found"));
      next(command);
    }

    return _.doto(FindHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function FoundHandler(compose){
    this.compose = compose;
  }

  var foundHandler = _.constructs(FoundHandler);

  (function(){

    function handle(self, event, next){
      var args = _.get(event, "args");
      switch (_.count(args)) {
        case 1:
          var type = _.first(args);
          self.compose(t.filter(function(entity){
            return _.first(_.get(entity, "$type")) == type;
          }));
          break;

        case 2:
          var key = _.first(args), value = _.second(args);
          self.compose(t.filter(function(entity){
            return _.includes(_.get(entity, key), value);
          }));
          break;

      }
      next(event);
    }

    return _.doto(FoundHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function TakeHandler(provider){
    this.provider = provider;
  }

  var takeHandler = _.constructs(TakeHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, sh.effect(command, "took"));
      next(command);
    }

    return _.doto(TakeHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function TookHandler(compose){
    this.compose = compose;
  }

  var tookHandler = _.constructs(TookHandler);

  (function(){

    function handle(self, event, next){
      self.compose(t.take(_.getIn(event, ["args", 0])));
      next(event);
    }

    return _.doto(TookHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SkipHandler(provider){
    this.provider = provider;
  }

  var skipHandler = _.constructs(SkipHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, sh.effect(command, "skipped"));
      next(command);
    }

    return _.doto(SkipHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SkippedHandler(compose){
    this.compose = compose;
  }

  var skippedHandler = _.constructs(SkippedHandler);

  (function(){

    function handle(self, event, next){
      self.compose(t.drop(_.getIn(event, ["args", 0])));
      next(event);
    }

    return _.doto(SkippedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LastHandler(provider){
    this.provider = provider;
  }

  var lastHandler = _.constructs(LastHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, sh.effect(command, "lasted"));
      next(command);
    }

    return _.doto(LastHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LastedHandler(compose){
    this.compose = compose;
  }

  var lastedHandler = _.constructs(LastedHandler);

  (function(){

    function handle(self, event, next){
      self.compose(t.last(_.getIn(event, ["args", 0])));
      next(event);
    }

    return _.doto(LastedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function PipeHandler(buffer, model, commandBus){
    this.buffer = buffer;
    this.model = model;
    this.commandBus = commandBus;
  }

  var pipeHandler = _.constructs(PipeHandler);

  (function(){

    function handle(self, command, next){
      var commands = _.get(command, "args");
      _.just(commands,
        _.map(_.assoc(_, "pipe-id",_.guid()), _),
        _.each($.dispatch(self.commandBus, _), _));
      next(command);
    }

    return _.doto(PipeHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LoadHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var loadHandler = _.constructs(LoadHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, e.loaded(_.get(command, "args")));
      next(command);
    }

    return _.doto(LoadHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LoadedHandler(buffer){
    this.buffer = buffer;
  }

  var loadedHandler = _.constructs(LoadedHandler);

  (function(){

    function handle(self, event, next){
      w.load(self.buffer, _.get(event, "args")); //TODO ITransientBuffer.load
      next(event);
    }

    return _.doto(LoadedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AddHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var addHandler = _.constructs(AddHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id") || _.guid(),
          args = _.get(command, "args");;
      $.raise(self.provider, e.added(args, {id: id}));
      next(command);
    }

    _.doto(AddHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AddedHandler(model, buffer, commandBus){
    this.model = model;
    this.buffer = buffer;
    this.commandBus = commandBus;
  }

  var addedHandler = _.constructs(AddedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id"),
          type = _.getIn(event, ["args", 0]),
          title = _.getIn(event, ["args", 1]);

      var added = ont.make(self.buffer, {id: _.str(id), $type: type});
      //TODO move default determination as attributes to the command where the event is computed
      //TODO expose `make` further down?
      var entity = _.reduce(function(memo, key){
          var fld = ont.fld(memo, key);
          return _.maybe(_.get(fld, "defaults"), function(defaults){
            return ont.aset(fld, memo, defaults);
          }) || memo;
        }, tidd.title(added, title), _.keys(added));

      _.swap(self.buffer, function(buffer){
        return w.add(buffer, [entity]);
      });

      //TODO create middleware which clears selections after certain actions, remove `model`
      _.just(self.model, _.deref, _.get(_, "selected"), _.toArray, c.deselect, $.dispatch(self.commandBus, _));
      $.dispatch(self.commandBus, c.select([], {id: [id]}));
      next(event);
    }

    _.doto(AddedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function ToggleHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var toggleHandler = _.constructs(ToggleHandler);

  (function(){

    _.doto(ToggleHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.toggled)}));

  })();

  function ToggledHandler(buffer){
    this.buffer = buffer;
  }

  var toggledHandler = _.constructs(ToggledHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id"),
          key = _.getIn(command, ["args", 0]);
      _.swap(self.buffer, function(buffer){
        return w.edit(buffer, _.mapa(_.pipe(_.get(buffer, _), _.update(_, key, _.mapa(_.not, _))), id));
      });
      next(command);
    }

    _.doto(ToggledHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();


  function TagHandler(handler){
    this.handler = handler;
  }

  var tagHandler = _.constructs(TagHandler);

  (function(){

    function handle(self, command, next){
      var altered = _.just(command, sh.alter(_, "assert"), _.update(_, "args", _.pipe(_.cons("tag", _), _.toArray)));
      $.handle(self.handler, altered, next);
      next(command);
    }

    _.doto(TagHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function UntagHandler(handler){
    this.handler = handler;
  }

  var untagHandler = _.constructs(UntagHandler);

  (function(){

    function handle(self, command, next){
      var altered =  _.just(command, sh.alter(_, "retract"), _.update(_, "args", _.pipe(_.cons("tag", _), _.toArray)));
      $.handle(self.handler, altered, next);
      next(command);
    }

    _.doto(UntagHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function CastHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var castHandler = _.constructs(CastHandler);

  (function(){

    //it's unavoidable that attributes may not line up on a cast, so cast wisely.
    function handle(self, command, next){
      var prior = _.get(self.buffer, _.get(command, "id")),
          id = _.get(command, "id"),
          type = _.getIn(command, ["args", 0]);
      if (prior) {
        var entity = ont.make(self.buffer, Object.assign({}, prior.attrs, {$type: type})),
            title  = tidd.title(prior),
            text   = tidd.text(prior);
        if (title){
          entity = tidd.title(entity, title);
        }
        if (text){
          entity = tidd.text(entity, text);
        }
        _.swap(self.buffer, function(buffer){
          return w.edit(buffer, [entity]);
        });
        $.raise(self.provider, e.casted([id, type]));
      }
      next(command);
    }

    _.doto(CastHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SaveHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var saveHandler = _.constructs(SaveHandler);

  (function (){

    function handle(self, command){
      w.save(self.buffer)
      $.raise(self.provider, e.saved());
    }

    _.doto(SaveHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SavedHandler(commandBus){
    this.commandBus = commandBus;
  }

  var savedHandler = _.constructs(SavedHandler);

  (function(){

    function handle(self, event, next){
      $.dispatch(self.commandBus, c.flush());
      next(event);
    }

    return _.doto(SavedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function journalsCommand(able, event){

    function handle(self, command, next){
      if (able(self.buffer)){
        $.raise(self.provider, event);
      }
      next(command);
    }

    return _.does(
      _.implement(IMiddleware, {handle: handle}));

  }

  function journalsEvent(effect){

    function handle(self, event, next){
      effect(self.buffer);
      next(event);
    }

    return _.does(
      _.implement(IMiddleware, {handle: handle}));

  }


  function UndoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var undoHandler = _.constructs(UndoHandler);

  _.doto(UndoHandler,
    journalsCommand(IRevertible.undoable, e.undone()));

  function UndoneHandler(buffer){
    this.buffer = buffer;
  }

  var undoneHandler = _.constructs(UndoneHandler);

  _.doto(UndoneHandler,
    journalsEvent(IRevertible.undo));

  function RedoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var redoHandler = _.constructs(RedoHandler);

  _.doto(RedoHandler,
    journalsCommand(IRevertible.redoable, e.redone()));

  function RedoneHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var redoneHandler = _.constructs(RedoneHandler);

  _.doto(RedoneHandler,
    journalsEvent(IRevertible.redo));

  function FlushHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var flushHandler = _.constructs(FlushHandler);

  _.doto(FlushHandler,
    journalsCommand(_.constantly(true), e.flushed()));

  function FlushedHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var flushedHandler = _.constructs(FlushedHandler);

  _.doto(FlushedHandler,
    journalsEvent(IRevertible.flush));

  function AssertHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var assertHandler = _.constructs(AssertHandler);

  (function(){

    _.doto(AssertHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.asserted)}));

  })();

  function AssertedHandler(buffer){
    this.buffer = buffer;
  }

  var assertedHandler = _.constructs(AssertedHandler);

  (function(){

    function handle(self, event, next){
      var key = _.getIn(event, ["args", 0]),
          value = _.getIn(event, ["args", 1]),
          id = _.get(event, "id");

      _.swap(self.buffer, function(buffer){
        return w.edit(buffer, _.mapa(function(id){
          return ont.assert(_.get(buffer, id), key, value);
        }, id));
      });

      next(event);
    }

    _.doto(AssertedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function BlockingHandler(key, buffer, handler){
    this.key = key;
    this.buffer = buffer;
    this.handler = handler;
  }

  var blockingHandler = _.constructs(BlockingHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id"),
          entity = _.get(self.buffer, id);
      if (entity) {
        var key = _.get(command, "key");
        if (_.get(ont.fld(entity, key), self.key)) {
          throw new Error("Field `" + key + "` is " + self.key + " and thus cannot " + _.identifier(command) + ".");
        }
        IMiddleware.handle(self.handler, command, next);
      }
      next(command);
    }

    _.doto(BlockingHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DestroyHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var destroyHandler = _.constructs(DestroyHandler);

  (function(){

    _.doto(DestroyHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.destroyed)}));

  })();

  function DestroyedHandler(buffer){
    this.buffer = buffer;
  }

  var destroyedHandler = _.constructs(DestroyedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id");
      _.swap(self.buffer, function(buffer){
        return w.destroy(buffer, _.mapa(_.get(buffer, _), id));
      });

      next(event);
    }

    _.doto(DestroyHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function RetractHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var retractHandler = _.constructs(RetractHandler);

  (function(){

    _.doto(RetractHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.retracted)}));

  })();

  function RetractedHandler(buffer){
    this.buffer = buffer;
  }

  var retractedHandler = _.constructs(RetractedHandler);

  (function(){

    function handle(self, event, next){
      var key = _.getIn(event, ["args", 0]),
          value = _.getIn(event, ["args", 1]),
          id = _.get(event, "id");

      _.swap(self.buffer, function(buffer){
        return w.edit(buffer, _.mapa(function(id){
          var entity = _.get(buffer, id);
          return _.isSome(value) ? ont.retract(entity, key, value) : ont.retract(entity, key);
        }, id));
      });

      next(event);
    }

    _.doto(RetractedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function QueryHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var queryHandler = _.constructs(QueryHandler);

  (function(){

    function handle(self, command, next){
      return _.fmap(repos.query(self.buffer, _.get(command, "plan")), function(entities){
        $.raise(self.provider, e.queried(entities));
        next(command);
      });
    }

    return _.doto(QueryHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function QueriedHandler(commandBus){
    this.commandBus = commandBus;
  }

  var queriedHandler = _.constructs(QueriedHandler);

  (function(){

    function handle(self, event, next){
      $.dispatch(self.commandBus, c.load(_.get(event, "args")));
      next(event);
    }

    return _.doto(QueriedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var selectHandler = _.constructs(SelectHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id");
      var missing = _.detect(_.complement(_.contains(self.buffer, _)), id);
      if (!missing) {
        $.raise(self.provider, e.selected([], {id: id}));
      } else {
        throw new Error("Entity " + _.str(missing) + " was not present in buffer.");
      }
      next(command);
    }

    return _.doto(SelectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectedHandler(model){
    this.model = model;
  }

  var selectedHandler = _.constructs(SelectedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id");
      _.swap(self.model,
        _.update(_, "selected",
          _.apply(_.conj, _, id)));
      next(event);
    }

    return _.doto(SelectedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DeselectHandler(model, provider){
    this.model = model;
    this.provider = provider;
  }

  var deselectHandler = _.constructs(DeselectHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, sh.effect(command, "deselected"));
      next(command);
    }

    return _.doto(DeselectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DeselectedHandler(model){
    this.model = model;
  }

  var deselectedHandler = _.constructs(DeselectedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id");
      _.swap(self.model,
        _.update(_, "selected",
          _.apply(_.disj, _, id))); //_.comp(_.toArray, _.remove(_.includes(id, _), _))
      next(event);
    }

    return _.doto(DeselectedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function PeekHandler(provider){
    this.provider = provider;
  }

  var peekHandler = _.constructs(PeekHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, sh.effect(command, "peeked"));
      next(command);
    }

    return _.doto(PeekHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function PeekedHandler(buffer, model){
    this.buffer = buffer;
    this.model = model;
  }

  var peekedHandler = _.constructs(PeekedHandler);

  (function(){
    function handle(self, event, next){
      _.just(self.model.state.selected, _.toArray, _.mapa(_.get(self.buffer, _), _), _.see("peeked"));
      next(event);
    }

    return _.doto(PeekedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectionMiddleware(model, pred){
    this.model = model;
    this.pred = pred;
  }

  var selectionMiddleware = _.constructs(SelectionMiddleware);

  (function(){

    function handle(self, message, next){
      if (!_.contains(message, "id") && self.pred(message)) {
        _.just(
          self.model,
          _.deref,
          _.get(_, "selected"), //a sequence!
          _.toArray,
          _.assoc(message, "id", _),
          next);
      } else {
        next(message);
      }
    }

    return _.doto(SelectionMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function FindMiddleware(model, buffer, pred, lastPipeId){
    this.model = model;
    this.buffer = buffer;
    this.pred = pred;
    this.lastPipeId = lastPipeId;
  }

  var findMiddleware = _.constructs(FindMiddleware);

  (function(){
    function handle(self, message, next){
      var pipeId = _.get(message, "pipe-id");

      if (_.notEq(pipeId, self.lastPipeId)) {
        _.swap(self.model, _.assoc(_, "find", null));
        _.log("cleared find cache!");
        self.lastPipeId = pipeId;
      }

      if (!_.contains(message, "id") && self.pred(message)) {
        var f = _.just(self.model, _.deref, _.get(_, "find"));
        if (f) {
          var id = _.just(self.buffer.workspace, //TODO demeter!
            _.deref,
            _.into([], _.comp(f, t.map(_.get(_, "id")), t.map(_.first)), _),
            _.assoc(message, "id", _),
            next);
          return;
        }
      }
      next(message);
    }

    return _.doto(FindMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function KeyedMiddleware(key, value){
    this.key = key;
    this.value = value;
  }

  var keyedMiddleware = _.constructs(KeyedMiddleware);

  (function(){
    function handle(self, message, next){
      _.just(message,
        _.assoc(_, self.key, self.value()),
        next);
    }

    return _.doto(KeyedMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  //NOTE a view is capable of returning a seq of all possible `IView.interactions` each implementing `IIdentifiable` and `INamable`.
  //NOTE an interaction is a persistent, validatable object with field schema.  It will be flagged as command or query which will help with processing esp. pipelining.  When successfully validated it has all that it needs to be handled by the handler.  That it can be introspected allows for the UI to help will completing them.
  function Outline(buffer, model, commandBus, eventBus, emitter, options){
    this.buffer = buffer;
    this.model = model;
    this.commandBus = commandBus;
    this.eventBus = eventBus;
    this.emitter = emitter;
    this.options = options;
  }

  function outline(buffer, options){
    var model = $.cell({
          root: options.root, //identify the root entities from where rendering begins
          selected: _.into(imm.set(), options.selected || []), //track which entities are selected
          expanded: _.into(imm.set(), options.expanded || []) //track which entities are expanded vs collapsed
        }),
        events = $.events(),
        commandBus = sh.bus(),
        eventBus = sh.bus(),
        emitter = $.subject();

    var entityDriven = _.comp(_.includes(["assert", "retract", "toggle", "destroy", "cast", "tag", "untag", "select", "deselect"], _), _.identifier);

    _.doto(commandBus,
      mut.conj(_,
        sh.lockingMiddleware(commandBus),
        keyedMiddleware("command-id", _.generate(_.iterate(_.inc, 1))),
        findMiddleware(model, buffer, entityDriven),
        selectionMiddleware(model, entityDriven),
        sh.teeMiddleware(_.see("command")),
        _.doto(sh.handlerMiddleware(),
          mut.assoc(_, "pipe", pipeHandler(buffer, model, commandBus)),
          mut.assoc(_, "find", findHandler(events)),
          mut.assoc(_, "take", takeHandler(events)),
          mut.assoc(_, "skip", skipHandler(events)),
          mut.assoc(_, "last", lastHandler(events)),
          mut.assoc(_, "peek", peekHandler(events)),
          mut.assoc(_, "load", loadHandler(buffer, events)),
          mut.assoc(_, "add", addHandler(buffer, events)),
          mut.assoc(_, "save", saveHandler(buffer, events)),
          mut.assoc(_, "undo", undoHandler(buffer, events)),
          mut.assoc(_, "redo", redoHandler(buffer, events)),
          mut.assoc(_, "flush", flushHandler(buffer, events)),
          mut.assoc(_, "cast", castHandler(buffer, events)),
          mut.assoc(_, "tag", tagHandler(commandBus)),
          mut.assoc(_, "untag", untagHandler(commandBus)),
          mut.assoc(_, "toggle", toggleHandler(buffer, events)),
          mut.assoc(_, "assert", assertHandler(buffer, events)),
          mut.assoc(_, "retract", retractHandler(buffer, events)),
          mut.assoc(_, "destroy", destroyHandler(buffer, events)),
          mut.assoc(_, "query", queryHandler(buffer, events)),
          mut.assoc(_, "select", selectHandler(buffer, events)),
          mut.assoc(_, "deselect", deselectHandler(model, events))),
        sh.drainEventsMiddleware(events, eventBus)));

    function compose(key, f){
      _.just(model, _.swap(_, _.update(_, key, function(g){
        return g ? _.comp(g, f) : f;
      })));
    }

    _.doto(eventBus,
      mut.conj(_,
        keyedMiddleware("event-id", _.generate(_.iterate(_.inc, 1))),
        sh.teeMiddleware(_.see("event")),
        _.doto(sh.handlerMiddleware(),
          mut.assoc(_, "peeked", peekedHandler(buffer, model)),
          mut.assoc(_, "found", foundHandler(_.partial(compose, "find"))),
          mut.assoc(_, "took", tookHandler(_.partial(compose, "find"))),
          mut.assoc(_, "skipped", skippedHandler(_.partial(compose, "find"))),
          mut.assoc(_, "lasted", lastedHandler(_.partial(compose, "find"))),
          mut.assoc(_, "loaded", loadedHandler(buffer)),
          mut.assoc(_, "added", addedHandler(model, buffer, commandBus)),
          mut.assoc(_, "saved", savedHandler(commandBus)),
          mut.assoc(_, "undone", undoneHandler(buffer)),
          mut.assoc(_, "redone", redoneHandler(buffer)),
          mut.assoc(_, "flushed", flushedHandler(buffer)),
          mut.assoc(_, "toggled", toggledHandler(buffer)),
          mut.assoc(_, "asserted", assertedHandler(buffer)),
          mut.assoc(_, "retracted", retractedHandler(buffer)),
          mut.assoc(_, "destroyed", destroyedHandler(buffer)),
          mut.assoc(_, "queried", queriedHandler(commandBus)),
          mut.assoc(_, "selected", selectedHandler(model)),
          mut.assoc(_, "deselected", deselectedHandler(model))),
        sh.eventMiddleware(emitter)));

    return new Outline(buffer, model, commandBus, eventBus, emitter, options);
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
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IDispatch, {dispatch: dispatch}),
      _.implement(ISubscribe, {sub: sub}),
      _.implement(IView, {render: render}));

  })();

  function Cursor(cell){
    this.cell = cell;
  }

  function deref(self){
    return _.just(self.cell, _.deref, _.deref);
  }

  function swap(self, f){
    _.swap(self.cell, _.fmap(_, f));
  }

  _.doto(Cursor,
    _.implement(_.IDeref, {deref: deref}),
    _.implement(_.ISwap, {swap: swap}));

  var $ws = new Cursor($.cell(_.journal(w.entityWorkspace())));

  var ol = _.doto(
    outline(
      w.buffer(
        jsonResource("../data/outline.json", tidd.tiddology),
        $ws),
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
      e: e,
      dirtyKeys: dirtyKeys,
      domain: domain
    }), _.impart(_, _.partly));

});
