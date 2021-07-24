import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as t from "atomic/transducers";

function handle(self, message, next){
  const pipeId = _.get(message, "pipe-id");

  if (_.notEq(pipeId, self.lastPipeId)) {
    _.reset(self.effects, []);
    _.log("cleared find cache!");
    self.lastPipeId = pipeId;
  }

  if (!_.contains(message, "id") && self.pred(message)) {
    const effects = _.deref(self.effects);
    if (_.seq(effects)) {
      const buffer = _.deref(self.buffer),
            f = _.apply(_.comp, _.mapa(self.compile, effects)),
            id = _.into([], _.comp(f, t.map(_.get(_, "id")), t.map(_.first)), buffer),
            select = _.assoc(message, "id", id);
      next(select);
      return;
    }
  }
  next(message);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
