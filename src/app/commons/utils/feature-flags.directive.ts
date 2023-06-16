import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { FeatureFlag } from "./feature-flags.enum";

@Directive({
    selector:"[feature]"
})
export class FeatureFlagDirective implements OnInit{
    @Input() feature:string;
    constructor(
        private readonly tpl:TemplateRef<any>,
        private readonly vcr:ViewContainerRef,
    ){
    }
    ngOnInit(): void {
      
    }
}