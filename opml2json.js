import {parse} from "https://deno.land/x/xml/mod.ts";
import {flatten} from "https://deno.land/x/denodash@v0.1.3/src/array/flatten.ts";

const [src] = Deno.args;
const dest = src.replace(".opml", ".json");
const uids = Deno.args.indexOf("--uids") > -1;

Deno.readTextFile(src).
  then(parse).
  then(transform).
  then(stringify).
  then(write(dest));

function seed(start){
  let n = start;
  return function(){
    return n++;
  }
}

function uid() {
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

const next = uids ? uid : seed(0);

function stringify(json){
  return JSON.stringify(json, null, "\t");
}

function write(dest){
  return function(text){
    Deno.writeTextFile(dest, text);
  }
}

function transform(source){
  var typed = {task: "task", note: "tiddler"};
  function drill(node, parent){
    function convert(child){
      const id = next();
      const item = {
        id: id,
        $type: typed[child["@type"]] || "task",
        title: child["@text"],
        child: []
      };
      if (child["@tags"]){
        item.tag = child["@tags"].split(",");
      }
      if (child["@priority"]){
        item.priority = parseInt(child["@priority"]);
      }
      if (child["@due"]){
        item.due = child["@due"];
      }
      if (child["@dateModified"]) {
        item.modified = child["@dateModified"];
      }
      parent.child.push(id);
      const items = drill(child, item);
      items.unshift(item);
      if (!item.child.length) {
        delete item.child;
      }
      return items;
    }
    return flatten(node.outline ? (node.outline.length ? node.outline.map(convert) : [convert(node.outline)]) : []);
  }
  const root = {
    id: next(),
    $type: "task",
    title: source.opml.head.title,
    child: [],
    modified: source.opml.head.dateModified
  };
  return flatten([root, drill(source.opml.body, root)]);
}
