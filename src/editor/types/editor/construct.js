import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as sh from "atomic/shell";
import * as t from "atomic/transducers";
import * as mut from "atomic/transients";
import * as imm from "atomic/immutables";
import * as w from "cosmos/work";
import * as ont from "cosmos/ontology";
import * as ms from "../../types/middlewares.js";
import * as ed from "../../types/handlers.js";
import {cursor} from "../../types/cursor/construct.js";

//NOTE a view is capable of returning a seq of all possible `IView.interactions` each implementing `IIdentifiable` and `INamable`.
//NOTE an interaction is a persistent, validatable object with field schema.  It will be flagged as command or query which will help with processing esp. pipelining.  When successfully validated it has all that it needs to be handled by the handler.  That it can be introspected allows for the UI to help will completing them.
export function Editor(repo, buffer, model, commandBus, eventBus, emitter, peeked, options){
  this.repo = repo;
  this.buffer = buffer;
  this.model = model;
  this.commandBus = commandBus;
  this.eventBus = eventBus;
  this.emitter = emitter;
  this.peeked = peeked;
  this.options = options;
}

export function editor(lib, repo, options){
  const $state = $.cell(_.journal({
          buffer: w.buffer(repo, w.indexedEntityWorkspace(lib)),
          effects: [],
          root: options.root, //identify the root entities from where rendering begins
          selected: _.into(imm.set(), options.selected || []), //track which entities are selected
          expanded: _.into(imm.set(), options.expanded || []) //track which entities are expanded vs collapsed
        })),
        model = cursor($state),
        events = sh.events(),
        commandBus = sh.messageBus(),
        eventBus = sh.messageBus(),
        emitter = $.subject(),
        peeked = $.cell(),
        selected = $.cursor(model, ["selected"]),
        buffer = $.cursor(model, ["buffer"]),
        effects = $.cursor(model, ["effects"]);

  const entityDriven = _.comp(_.includes(["assert", "retract", "toggle", "destroy", "cast", "tag", "untag", "select", "deselect"], _), _.identifier);

  function search(self, events){
    const buffer = _.deref(self.buffer);
    const criteria = _.just(events, _.takeWhile(function(event){
      return event.type == "found";
    }, ?), _.mapa(function(event){
      const args = _.get(event, "args");
      return _.count(args) == 1 ? ont.criterion(null, "$type", _.first(args)) : ont.criterion(null, _.first(args), _.second(args));
    }, ?));
    return _.reduce(function(memo, event){
      const args = _.get(event, "args");
      switch (event.type) { //TODO install via map?
        case "took":
          return _.take(_.first(args), memo);
        case "skipped":
          return _.drop(_.first(args), memo);
        case "lasted":
          return _.last(_.first(args), memo);
        case "dirtied":
          return _.filter(_.comp(w.modified(buffer, ?), w.id), memo);
        case "freshed":
          return _.filter(_.comp(w.created(buffer, ?), w.id), memo);
        case "found":
          return _.filter(w.meets(?, [_.count(args) == 1 ? ont.criterion(null, "$type", _.first(args)) : ont.criterion(null, _.first(args), _.second(args))]), memo);
        default:
          return memo;
      }
    }, ont.search(buffer, criteria), _.dropWhile(function(event){
      return event.type == "found";
    }, events));
  }

  _.doto(commandBus,
    mut.conj(_,
      sh.lockingMiddleware(commandBus),
      ms.errorMiddleware(console.error.bind(console)),
      ms.findMiddleware(effects, search, buffer, entityDriven),
      ms.selectionMiddleware(selected, entityDriven),
      sh.teeMiddleware(_.see("command")),
      _.doto(sh.handlerMiddleware(),
        mut.assoc(_, "pipe", ed.pipeHandler(_.uid, buffer, model, commandBus)),
        mut.assoc(_, "find", ed.effectHandler(events, "found")),
        mut.assoc(_, "take", ed.effectHandler(events, "took")),
        mut.assoc(_, "skip", ed.effectHandler(events, "skipped")),
        mut.assoc(_, "last", ed.effectHandler(events, "lasted")),
        mut.assoc(_, "dirty", ed.effectHandler(events, "dirtied")),
        mut.assoc(_, "fresh", ed.effectHandler(events, "freshed")),
        mut.assoc(_, "peek", ed.peekHandler(events)),
        mut.assoc(_, "load", ed.loadHandler(buffer, events)),
        mut.assoc(_, "add", ed.addHandler(repo, buffer, events)),
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
      sh.teeMiddleware(_.see("event")),
      _.doto(sh.handlerMiddleware(),
        mut.assoc(_, "peeked", ed.peekedHandler(buffer, selected, _.does(_.reset(peeked, ?), _.see("peeked")))),
        mut.assoc(_, "found", ed.effectedHandler(effects)),
        mut.assoc(_, "took", ed.effectedHandler(effects)),
        mut.assoc(_, "skipped", ed.effectedHandler(effects)),
        mut.assoc(_, "lasted", ed.effectedHandler(effects)),
        mut.assoc(_, "dirtied", ed.effectedHandler(effects)),
        mut.assoc(_, "freshed", ed.effectedHandler(effects)),
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
        mut.assoc(_, "selected", ed.selectedHandler(selected)),
        mut.assoc(_, "deselected", ed.deselectedHandler(model))),
      sh.eventMiddleware(emitter)));

  return new Editor(repo, buffer, model, commandBus, eventBus, emitter, peeked, options);
}

