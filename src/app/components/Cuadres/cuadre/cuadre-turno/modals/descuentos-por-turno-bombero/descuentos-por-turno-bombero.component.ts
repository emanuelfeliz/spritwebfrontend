import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { CreditUserService } from 'app/services/credit_user.service';
import { DialogService, DialogComponent } from 'ng6-bootstrap-modal';
import { Component, OnInit } from '@angular/core';
import { CreditUserDiscount } from 'app/models/credit_user/creditUserDiscount.model';

export interface DescuentosPorTurnoBomberoModel {
  turno: number;
  bombero: string;
 }

@Component({
  selector: 'app-descuentos-por-turno-bombero',
  templateUrl: './descuentos-por-turno-bombero.component.html',
  styleUrls: ['./descuentos-por-turno-bombero.component.css']
})
export class DescuentosPorTurnoBomberoComponent extends DialogComponent<DescuentosPorTurnoBomberoModel, null>  implements OnInit, DescuentosPorTurnoBomberoModel {

  turno: number;
  bombero: string;
  p = 1;
  constructor(dialogService: DialogService, private creditUserService: CreditUserService, private popupService: PopupProviderService)
   {
     super(dialogService);
    }

  crediUserDiscount: CreditUserDiscount = {
    id: 0,
    userid: 0,
    saleid: 0,
    date: null,
    amount: 0,
    pendingamount: 0,
    discountcategoryid: 0,
    isCreditSale: false,
    saleAmount: 0,
    volume: 0,
    userRnc: '',
    paymentId: '',
    isInstantDiscount: false,
    turno: 0,
    bombero: '',
    volumen: 0
    }

    crediUserDiscountList: CreditUserDiscount[] = [];


  ngOnInit() {
    this.loadCountedPayments();
  }

  loadCountedPayments(): void {
    this.creditUserService.getDiscountsByTurnoAndBombero(this.turno,this.bombero).then((result) => {
         this.crediUserDiscountList = result.List;

    }).catch((error) => {
      this.popupService.SimpleMessage('Error', `Error bucando los descuentos. ${error}`, PopupType.ERROR);
    });
  }

public cerrar() {
    this.close();
}

}
