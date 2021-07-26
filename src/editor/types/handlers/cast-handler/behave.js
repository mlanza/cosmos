import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as ont from "cosmos/ontology";
import * as w from "cosmos/work";
import * as ol from "cosmos/outlines";
import * as e from "../../events.js";

//It's unavoidable that attributes may not line up on a cast, so cast wisely.
function handle(self, command, next){
  const prior = _.get(self.buffer, _.get(command, "id")),
        id = _.get(command, "id"),
        $type = _.getIn(command, ["args", 0]);
  if (prior) {
    const entity = ont.make(self.buffer, Object.assign({}, prior.attrs, {$type})),
          title  = ol.title(prior),
          text   = ol.text(prior);
    if (title){
      entity = ol.title(entity, title);
    }
    if (text){
      entity = ol.text(entity, text);
    }
    _.swap(self.buffer, function(buffer){
      return w.edit(buffer, [entity]);
    });
    sh.raise(self.provider, e.casted([id, type]));
  }
  next(command);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
