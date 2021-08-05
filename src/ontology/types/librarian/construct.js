export function Librarian(strategies){
  this.strategies = strategies;
}

export function librarian(strategies){
  return new Librarian(strategies || []);
}
