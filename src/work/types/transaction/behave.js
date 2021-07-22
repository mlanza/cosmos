import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IEntity} from "../../protocols/ientity/instance.js";
import {ITransaction} from "../../protocols/itransaction/instance.js";

function id(self){
  return p.id(self.buffer);
}

function commands(self){ //TODO serializable commands with sufficient data for later application
  return p.commands(self.buffer); //TODO wrap each command with additional information (e.g. user, owning txn id)
}

export default _.does( //TODO some way of validating both the changed entities and the overall transaction
  _.implement(IEntity, {id}),
  _.implement(ITransaction, {commands}));

