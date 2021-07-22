export function Bus(middlewares){
  this.middlewares = middlewares;
}

export function bus(middlewares){
  return new Bus(middlewares || []);
}
