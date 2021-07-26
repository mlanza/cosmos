import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json  from '@rollup/plugin-json';

export default {
  input: [
    'src/ontology.js',
    'src/work.js',
    'src/outlines.js',
    'src/repos.js',
    'src/editor.js'
  ],
  output: {
    dir: 'public/assets/vendor/cosmos',
    format: 'amd',
    interop: false,
    globals: {
      "jquery": "jQuery",
      "qunit": "QUnit",
      "fetch": "fetch",
      "map": "Map",
      "set": "Set",
      "weak-map": "WeakMap",
      "symbol": "Symbol",
      "promise": "Promise",
      "immutable": "Immutable"
    }
  },
  external: [
    "immutable",
    "promise",
    "fetch",
    "symbol",
    "weak-map",
    "set",
    "map",
    "qunit",
    "jquery",
    "dom",
    "rxjs",
    "atomic",
    "atomic/core",
    "atomic/immutables",
    "atomic/reactives",
    "atomic/shell",
    "atomic/transducers",
    "atomic/transients",
    "atomic/repos",
    "atomic/validates",
    "atomic/html",
    "atomic/svg",
    "atomic/dom",
    "cosmos/ontology",
    "cosmos/work",
    "cosmos/outlines",
    "cosmis/editor"
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'inline'
    }),
    json()
  ]
};
