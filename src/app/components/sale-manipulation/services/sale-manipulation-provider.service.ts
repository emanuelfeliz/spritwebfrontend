import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { BomberoByLado } from '../../../models/manipulacion-venta/BomberoByLado.model';
import { Venta } from '../../../models/listado-ventas/venta.model';
import { Router } from '@angular/router';
import { PaymentSale } from '../../../models/manipulacion-venta/PaymentSale.model';
import { ClienteFidelizado } from 'app/models/clientes-fidelizados/ClienteFidelizado.model';
import { Client } from '_debugger';
import { Comodin } from 'app/models/manipulacion-venta/Comodin.model';
import { Incentivo } from 'app/models/incentivo/incentivo.model';
import { Modalidad } from 'app/models/configuracion_puntajes_fidelidad/Modalidad.model';

@Injectable({
  providedIn: 'root'
})
export class SaleManipulationProviderService {

  keyPressInfo: Subject<{ key: string, receiver: string }> = new BehaviorSubject<{ key: string, receiver: string }>(null);
  keyPressInfoEmitter: Observable<{ key: string, receiver: string }> = this.keyPressInfo.asObservable();

  bomberoYLadoInfo: Subject<BomberoByLado> = new BehaviorSubject<BomberoByLado>(null);
  bomberoYLadoInfoEmitter: Observable<BomberoByLado> = this.bomberoYLadoInfo.asObservable();
  ventaInfo: Venta;
  ventaI: number;
  ladoSeleccionado: number;
  comodin: Comodin;
  rnc: {
    cliente: string,
    rnc: string
  };
  paymentSale: PaymentSale;
  instruccion: string;
  paymentType: string;
  constructor() {
    this.comodin = new Comodin(false, '', new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','',''), 0, new Incentivo(0, '', '', 0, false, ''), new Modalidad(false, false));
    this.paymentSale = new PaymentSale();
  }
  resetearFlujo = (): Promise<any> => {
    return new Promise((resolve) => {
      this.ventaInfo = null;
      this.ventaI = null;
      this.comodin = new Comodin(false, '', new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','',''), 0, new Incentivo(0, '', '', 0, false, ''), new Modalidad(false, false));
      this.rnc = {
        rnc: '',
        cliente: ''
      };
      this.paymentSale = new PaymentSale();
      this.instruccion = '';
      this.ladoSeleccionado = 0;
      this.paymentType = '';
      resolve();
    });
  }
  emitBomberoYLadoInfo = (data: BomberoByLado): void => {
    this.bomberoYLadoInfo.next(data);
  }
  emitKeyPressInfo = (data: { key: string, receiver: string } | null): void => {
    this.keyPressInfo.next(data);
  }
}
