import * as _ from "atomic/core";
import * as vd from "atomic/validates";
import * as p from "./protocols/concrete.js";
import * as ont from "cosmos/ontology";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";
import {Tiddler, Task} from "./types.js";

export const defaults = _.conj(ont.schema(),
  _.assoc(ont.field("id", ont.entity, function(coll){
    return ont.recaster(_.uid, _.str, ont.valueCaster(coll)); //TODO uid might be an option
  }), "label", "ID"),
  _.assoc(ont.field("title", ont.required), "label", "Title"),
  _.assoc(ont.field("text", ont.optional), "label", "Text"),
  _.assoc(ont.field("child", ont.resolvingCollection(vd.and(vd.unlimited, vd.collOf(vd.isa(Task, Tiddler))), ont.entities), function(coll){
    return ont.recaster(_.uid, _.identity, ont.valuesCaster(coll));
  }), "label", "Child"),
  _.assoc(ont.field("tag", ont.unlimited, ont.valuesCaster), "label", "Tag", "appendonly", true),
  _.assoc(ont.field("modified", vd.constrain(ont.optional, vd.collOf(_.isDate)), function(coll){
    return ont.recaster(_.date, toLocaleString, ont.valueCaster(coll));
  }), "label", "Modified Date"));

function typed(entity){
  return _.identifier(entity.topic);
}

function flag(name, pred){
  return function(entity){
    return pred(entity) ? name : null;
  }
}

function isOverdue(entity){
  return _.maybe(entity, _.get(_, "due"), _.first, _.gt(new Date(), _)); //impure
}

function isImportant(entity){
  return _.maybe(entity, _.get(_, "priority"), _.detect(_.eq(_, 1), _));
}

const toLocaleString = _.invokes(_, "toLocaleString");

export const tiddler =
  ont.topic(Tiddler,
    "tiddler",
    _.conj(defaults,
      _.assoc(ont.computedField("flags", [typed]), "label", "Flags")));

export const task =
  ont.topic(Task,
    "task",
    _.conj(defaults,
      _.assoc(ont.field("priority", vd.constrain(ont.optional, vd.collOf(vd.choice([1, 2, 3])))), "label", "Priority"),
      _.assoc(ont.field("due", vd.constrain(ont.optional, vd.collOf(_.isDate)), function(coll){
        return ont.recaster(_.date, toLocaleString, ont.valueCaster(coll));
      }), "label", "Due Date"),
      _.assoc(ont.computedField("overdue", [isOverdue]), "label", "Overdue"),
      _.assoc(ont.computedField("flags", [typed, flag("overdue", isOverdue), flag("important", isImportant)]), "label", "Flags"),
      _.assoc(ont.field("assignee", ont.entities), "label", "Assignee"),
      _.assoc(ont.field("expanded", vd.constrain(ont.required, vd.collOf(_.isBoolean))), "label", "Expanded")));

export const tiddology = _.conj(ont.ontology(), tiddler, task);
