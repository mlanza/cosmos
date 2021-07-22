import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as mut from "atomic/transients";

function conj(self, middleware){
  self.middlewares = _.conj(self.middlewares, middleware);
}

function handle(self, message, next){
  var f = _.reduce(function(memo, middleware){
    return $.handle(middleware, _, memo);
  }, next || _.noop, _.reverse(self.middlewares));
  f(message);
}

function dispatch(self, message){
  handle(self, message);
}

export default _.does(
  _.implement(mut.ITransientCollection, {conj}),
  _.implement($.IDispatch, {dispatch}),
  _.implement($.IMiddleware, {handle}));
