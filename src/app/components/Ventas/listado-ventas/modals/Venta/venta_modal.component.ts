import { VentaFabricada } from 'app/models/listado-ventas/VentaFabricada.model';
import { Component, OnInit} from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import {Venta} from '../../../../../models/listado-ventas/Venta.model';
export interface IVenta {
  ventaRecibidaFabricada:VentaFabricada;
  ventaRecibidaSistema:Venta;
}
@Component({
  selector: 'app-modals',
  templateUrl: './venta_modal.component.html'
})
export class VentaModalComponent extends DialogComponent<IVenta, string> implements IVenta,OnInit  {
  ventaRecibidaFabricada:VentaFabricada;
  ventaRecibidaSistema:Venta;


  ventaFabricada:VentaFabricada;
  ventaSistema:Venta;

  ngOnInit(){
    if(this.ventaRecibidaFabricada!=null){
      this.ventaFabricada=this.ventaRecibidaFabricada;
    }else if(this.ventaRecibidaSistema!=null){
      this.ventaSistema=this.ventaRecibidaSistema;
    }    
  }
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  cerrar(){
    this.close();
  }
}
