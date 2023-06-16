import { Module } from './Module.model';
import { Process } from './Process.model';
export class vmModuleProcess{
    public constructor(
        public activating:boolean,
        public module:Module,
        public process:Process        
    ){}
}