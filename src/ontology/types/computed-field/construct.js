export function ComputedField(attrs, computations, emptyColl){
  this.attrs = attrs;
  this.computations = computations;
  this.emptyColl = emptyColl;
}

export function computedField(key, computations, emptyColl){
  return new ComputedField({key: key, readonly: true, missing: false, computed: true}, computations, emptyColl || []);
}
