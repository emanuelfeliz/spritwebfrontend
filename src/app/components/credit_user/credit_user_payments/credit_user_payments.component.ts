import { Component, OnInit } from '@angular/core';
import { CreditUserService } from 'app/services/credit_user.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { Pago } from 'app/models/pagos/Pago.model';
import { ProductosService } from 'app/services/productos.service';
import { Product } from 'app/models/multiple_bills/product.model';
import { Bombero } from 'app/models/bomberos/bomberos.model';
import { AperturaTurnosService } from 'app/services/apertura_turno.service';

@Component({
    selector: 'app-credit-user-payments',
    templateUrl: './credit_user_payments.component.html'
})

export class CreditUserPaymentsComponent implements OnInit {

    p = 1;
    fromDate = "";
    toDate = "";
    product: string = '';
    total: number = 0;
    bomberoSelected = '';
    client_code: string = '';
    total_credit: number = 0;
    total_credit_discount: number = 0;
    bomberos: Bombero[] = [];
    products: Array<Product>;
    credit_payments: Array<Pago>;
    loadingData: boolean = false;

    constructor(private creditUserService: CreditUserService, private productService: ProductosService,
        public AperturaTurnosService: AperturaTurnosService, private popupProviderService: PopupProviderService) { }

    ngOnInit(): void {
        this.getCreditPayments();
        this.loadTanksProducts();
        this.getBomberos();
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

    getCreditPayments(page: number = 0): void {
        this.p = page !== 0 ? page : this.p;
        this.loadingData = true;

        this.creditUserService.getCreditPayments(this.fromDate, this.toDate, this.bomberoSelected, this.client_code, this.product, 0, this.p).then(
            result => {
                if (result.PossibleError === '') {
                    this.loadingData = false;
                    this.total_credit = 0;
                    this.total_credit_discount = 0;
                    this.credit_payments = result.List;
                    this.total = result.TotalRecords;
                    this.credit_payments.forEach(x => {
                        this.total_credit += x.money;
                        this.total_credit_discount += x.money - x.discountAmount;
                    });
                } else {
                    this.popupProviderService.SimpleMessage("Pagos de credito", `Error: ${result.PossibleError}`, PopupType.ERROR)
                }
            }).catch(error => {
                console.log(error);
                this.popupProviderService.SimpleMessage("Pagos de credito", `Error: error de parte del servidor`, PopupType.ERROR)
            });
    }

    exportCreditPaymentsToExcel(): void {
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
