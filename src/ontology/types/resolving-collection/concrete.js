import * as vd from "atomic/validates";

export function resolved(self){
  return vd.constraints(self.coll, self.constraints);
}
