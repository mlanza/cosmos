import * as _ from "atomic/core";

export function Topic(type, attrs, struct){
  this.type = type;
  this.attrs = attrs;
  this.struct = struct;
}

function topic3(type, key, struct){
  return topic4(type, type.name, key, struct);
}

function topic4(type, label, key, struct){
  return new Topic(type, {label: label, key: key}, struct);
}

export const topic = _.overload(null, null, null, topic3, topic4);
