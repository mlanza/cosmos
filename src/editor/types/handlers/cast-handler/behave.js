import * as _ from "atomic/core";
import * as sh from "atomic/shell";
import * as ont from "cosmos/ontology";
import * as w from "cosmos/work";
import * as ol from "cosmos/outlines";
import * as e from "../../events.js";

//It's unavoidable that attributes may not line up on a cast, so cast wisely.
function handle(self, command, next){
  const id = _.get(command, "id"),
        args = _.get(command, "args"),
        $type = _.first(args);
  _.swap(self.buffer, w.modify(?, function(prior, buffer){
    const entity = ont.make(buffer, Object.assign({}, prior.attrs, {$type})),
          title  = ol.title(prior),
          text   = ol.text(prior);
    if (title){
      entity = ol.title(entity, title);
    }
    if (text){
      entity = ol.text(entity, text);
    }
    return entity;
  }, ...id));
  sh.raise(self.provider, sh.effect(command, "casted"));
  next(command);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
