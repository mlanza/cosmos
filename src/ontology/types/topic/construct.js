import * as _ from "atomic/core";

export function Topic(type, attrs, schema){
  this.type = type;
  this.attrs = attrs;
  this.schema = schema;
}

function topic3(type, key, schema){
  return topic4(type, type.name, key, schema);
}

function topic4(type, label, key, schema){
  return new Topic(type, {label: label, key: key}, schema);
}

export const topic = _.overload(null, null, null, topic3, topic4);
