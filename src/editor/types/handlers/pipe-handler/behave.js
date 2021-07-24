import * as _ from "atomic/core";
import * as sh from "atomic/shell";

function handle(self, command, next){
  const commands = _.get(command, "args");
  _.just(commands,
    _.map(_.assoc(_, "pipe-id", self.ids()), _),
    _.each(sh.dispatch(self.commandBus, _), _));
  next(command);
}

export default _.does(
  _.implement(sh.IMiddleware, {handle}));
