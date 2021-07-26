import * as _ from "atomic/core";
import * as ont from "cosmos/ontology";
import {ITiddler} from "./instance.js";

export const title = ITiddler.title;
export const text = ITiddler.text;
export function tiddles(title, text){

  function accessor(key){

    function read(self){
      return _.just(self, _.get(_, key), _.first);
    }

    function write(self, text){
      return ont.assert(self, key, text);
    }

    return _.overload(null, read, write);
  }

  return _.does(
    _.implement(ITiddler, {title: accessor(title), text: accessor(text)}));

}
