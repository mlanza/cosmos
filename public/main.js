define(['fetch', 'atomic/core', 'atomic/dom', 'atomic/transducers', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'atomic/repos', 'cosmos/ontology', 'atomic/shell', 'cosmos/work', 'cosmos/outlines', 'commands', 'cosmos/editor', 'cosmos/repos', 'context'], function(fetch, _, dom, t, mut, $, vd, imm, repos, ont, sh, w, ol, c, ed, re, context){

  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var editor = ed.editor(
    ol.lib,
    re.jsonRepo(
      "../data/outline.json",
      ol.outlines),
    {root: null});

  $.sub(editor,
    t.filter(function(e){
      return e.type === "loaded";
    }),
    function(e){
      _.each(sh.dispatch(editor, _), [
        c.pipe([
          c.find(["outline"]),
          c.last([2]),
          c.select(),
          c.peek()
        ]),
        c.select([], {id: [_.uid("24wab8")]}),
        c.tag(["test"], {id: [_.uid("cklqr1")]}),
        c.tag(["cosmos"]),
        c.pipe([
          c.add(["outline", "Scooby"]),
          c.select(),
          c.tag(["sleuth"]),
          c.tag(["dog"]),
        ]),
        c.select([], {id: [_.uid("24wab8"), _.uid("cklqr1"), _.uid("3bpwhp")]}),
        c.peek()
      ]);
    });

  sh.dispatch(editor, c.query());

  $.sub(editor.buffer, t.map(_.get(_, _.uid("6slexy"))), t.dedupe(), _.see("#6slexy"));

  return editor;

});
