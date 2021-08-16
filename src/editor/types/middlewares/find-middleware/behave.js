import * as _ from "atomic/core";
import * as sh from "atomic/shell";
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
      const entities = self.find(self, effects),
            id = _.into([], _.comp(t.map(_.get(_, "id")), t.map(_.first)), entities);
      next(_.assoc(message, "id", id));
      return;
    }
  }
  next(message);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
