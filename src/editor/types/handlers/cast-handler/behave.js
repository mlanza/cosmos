import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as ont from "cosmos/ontology";
import * as w from "cosmos/work";
import * as tidd from "cosmos/tiddology";
import * as e from "../../events.js";

//It's unavoidable that attributes may not line up on a cast, so cast wisely.
function handle(self, command, next){
  var prior = _.get(self.buffer, _.get(command, "id")),
      id = _.get(command, "id"),
      $type = _.getIn(command, ["args", 0]);
  if (prior) {
    var entity = ont.make(self.buffer, Object.assign({}, prior.attrs, {$type})),
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

export default _.does(
  _.implement($.IMiddleware, {handle}));
