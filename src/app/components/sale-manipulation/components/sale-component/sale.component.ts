
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Venta } from '../../../../models/listado-ventas/venta.model';
@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html'
})
export class SaleComponent implements OnInit {
    @Input() venta: Venta;
    @Input() i: number;
    @Input() showSelectSaleButton: boolean;
    @Output() seleccionarVenta = new EventEmitter();

    constructor() { }

    SelectSale = (): void => {
        this.seleccionarVenta.emit({ venta: this.venta, i: this.i });
    }
    ngOnInit() {
    }

}
