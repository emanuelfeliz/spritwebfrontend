import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Component, OnInit } from "@angular/core";
import { DiscountByCategory } from "app/models/credit_user/discountByCategory.model";
import { CreditUserService } from "app/services/credit_user.service";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";

export interface EditDiscountByCategoryModel {
    discountByCategoryId: number;
}

@Component({
    selector: 'modal_discount_by_category-app',
    templateUrl: './edit_discount_by_category_modal.component.html'
})

export class EditDiscountByCategoryModalComponent extends DialogComponent<EditDiscountByCategoryModel, null> implements OnInit, EditDiscountByCategoryModel {

    discountByCategoryId: number;

    discountByCategory: DiscountByCategory = {
        categoryname: '',
        isActive: true,
        id: 0,
        categoryType: '',
        discountpergalon: 0
    };

    constructor(dialogService: DialogService, private credit_user_service: CreditUserService, private popupService: PopupProviderService) {
        super(dialogService);
    }

    validate(): boolean {
        if (this.discountByCategory.categoryname === '' || this.discountByCategory.discountpergalon === null) {
            return true;
        }
        return false;
    }

    getdiscountByCategoryById(): void {
        this.credit_user_service.getDiscountByCategoryId(this.discountByCategoryId)
            .then((result) => {
                if (result.Success) {
                    this.discountByCategory = result.Response;
                }
                else {
                    this.popupService.SimpleMessage('Categoria de descuento', `Error buscando la categoria de descuento.
                ${result.PossibleError}`, PopupType.ERROR);
                    this.close();
                }

            }).catch((error) => {
                this.popupService.SimpleMessage('Categoria de descuento', `Error buscando la categoria de descuento. ${error}`, PopupType.ERROR);
            });
    }

    editdiscountByCategory(): void {
        this.credit_user_service.editDiscountByCategory(this.discountByCategory).then((result) => {
            if (result.Success) {
                this.popupService.SimpleMessage('Categoria de descuento', 'La categoria fue actualizada con exito.', PopupType.SUCCESS);
                this.close();

            } else {
                this.popupService.SimpleMessage('Categoria de descuento', `El error edito el usuario. ${result.PossibleError}`, PopupType.ERROR);
                this.close();
            }
        })
            .catch((error) => {
                this.popupService.SimpleMessage('Categoria de descuento', `Error buscando la categoria de descuento. ${error}`, PopupType.ERROR);
            });
    }

    ngOnInit(): void {

        this.getdiscountByCategoryById();
    }
    cerrar() {
        this.close();
    }
}
