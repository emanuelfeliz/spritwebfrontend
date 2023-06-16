import { Component, OnInit } from '@angular/core';
import { CreditUserService } from 'app/services/credit_user.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { Pago } from 'app/models/pagos/Pago.model';
import { AperturaTurnosService } from 'app/services/apertura_turno.service';
import { ProductosService } from 'app/services/productos.service';
import { Product } from 'app/models/multiple_bills/product.model';
import { Bombero } from 'app/models/bomberos/bomberos.model';

@Component({
    selector: 'app-counted-payments',
    templateUrl: './counted_payments.component.html'
})

export class CountedPaymentsComponent implements OnInit {

    p = 1;
    fromDate = "";
    toDate = "";
    product: string = '';
    total: number = 0;
    bomberoSelected = '';
    client_code: string = '';
    client_cedula: string = '';
    total_credit: number = 0;
    total_credit_discount: number = 0;
    bomberos: Bombero[] = [];
    products: Array<Product>;
    counted_payments: Array<Pago>;
    loadingData: boolean = false;
    discount_type: string = "Pago Contado";

    constructor(private creditUserService: CreditUserService, private productService: ProductosService,
        public AperturaTurnosService: AperturaTurnosService, private popupProviderService: PopupProviderService) { }

    ngOnInit(): void {
        this.getCountedPayments();
        this.getBomberos();
        this.loadTanksProducts();
    }

    getBomberos = () => {
        this.AperturaTurnosService.cargarBomberos()
            .then(
                result => {
                    if (result.PossibleError == '') {
                        this.bomberos = result.List;
                    }
                }
            ).catch(error => {
                this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
            });
    }

    loadTanksProducts() {
        this.productService.getAllProducts()
            .then((result) => {
                if (result.PossibleError === '') {
                    this.products = result.List;
                }
            })
            .catch(error => {
                this.popupProviderService.SimpleMessage('Facturación Multiple', 'Error cargando los gasolinas', PopupType.ERROR);
            });
    }

    getCountedPayments(page: number = 0): void {
        var tempTotalCredit: number = 0;
        var tempTotalCreditDiscount: number = 0;
        this.p = page !== 0 ? page : this.p;
        this.loadingData = true;
        this.creditUserService.getCountedPayments(this.fromDate, this.toDate, this.bomberoSelected, this.client_code, this.product, 0, this.p, this.discount_type).then(
            result => {
                if (result.PossibleError === '') {
                    this.loadingData = false;
                    this.total = result.TotalRecords;
                    this.counted_payments = result.List;
                    result.List.forEach(function(element){
                       tempTotalCredit += element.money;
                       tempTotalCreditDiscount += element.money - element.discountAmount;
                    });
                    this.total_credit = tempTotalCredit;
                    this.total_credit_discount = tempTotalCreditDiscount;
                } else {
                    this.popupProviderService.SimpleMessage("Pagos contados", `Error: ${result.PossibleError}`, PopupType.ERROR)
                }
            }).catch(error => {
                console.log(error);
                this.popupProviderService.SimpleMessage("Pagos contados", `Error: error de parte del servidor`, PopupType.ERROR)
            });
    }

    exportCountedPaymentsToExcel(): void {
        this.creditUserService.exportCreditPaymentsToExcel()
          .then((response) => {
            if (response === 'EXPORTADOS') {
              this.popupProviderService.SimpleMessage('Pagos', 'Pagos exportados', PopupType.SUCCESS);
            } else {
              this.popupProviderService.SimpleMessage('Pagos', response, PopupType.ERROR);
            }
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Pagos', error, PopupType.ERROR);
          });
      }

}
