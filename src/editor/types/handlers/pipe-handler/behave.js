import * as _ from "atomic/core";
import * as $ from "atomic/reactives";

function handle(self, command, next){
  const commands = _.get(command, "args");
  _.just(commands,
    _.map(_.assoc(_, "pipe-id", _.guid()), _), //TODO pass guid/seed in as dep
    _.each($.dispatch(self.commandBus, _), _));
  next(command);
}

export default _.does(
  _.implement($.IMiddleware, {handle}));
