import { Injectable, ElementRef } from "@angular/core";

@Injectable()
export class IframePrintService {
    imprimir(template: string, iframe: ElementRef): void {
        let contentWindow = iframe.nativeElement.contentWindow;
        contentWindow.document.open();
        contentWindow.document.write(template);
        contentWindow.document.close();
        setTimeout(() => { contentWindow.print(); }, 500);
    }
}