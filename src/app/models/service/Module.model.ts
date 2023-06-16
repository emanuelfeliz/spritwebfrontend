import { Process } from "./Process.model";

export class Module{
    public constructor(
        public Name:string,
        public Procceses: Array<Process>,
        public status:string
    ){}
}