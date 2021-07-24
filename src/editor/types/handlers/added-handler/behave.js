import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as c from "../../commands.js";
import * as ont from "cosmos/ontology";
import * as w from "cosmos/work";
import * as tidd from "cosmos/tiddology";

function handle(self, event, next){
  var id = _.get(event, "id"),
      type = _.getIn(event, ["args", 0]),
      title = _.getIn(event, ["args", 1]);

  var added = ont.make(_.deref(self.buffer), {id: _.str(id), $type: type});
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

export default _.does(
  _.implement($.IMiddleware, {handle}));

