import * as _ from "atomic/core";
export const ITransaction = _.protocol({
  commands: null //returns one or more commands that when executed effect the transaction in its entirety
});
_.doto(_.Nil,
  _.implement(ITransaction, {commands: _.constantly(null)}));
