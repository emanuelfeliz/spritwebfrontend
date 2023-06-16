import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Component, OnInit } from "@angular/core";
import { DiscountByCategory } from "app/models/credit_user/discountByCategory.model";
import { CreditUserService } from "app/services/credit_user.service";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";

@Component({
    selector: 'modal_discount_by_category-app',
    templateUrl: './add_discount_by_category_modal.component.html'
})

export class AddDiscountByCategoryModalComponent extends DialogComponent<string, string> implements OnInit {

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
    addNewDiscountByCategory(): void {
        this.credit_user_service.addNewDiscountByCategory(this.discountByCategory)
            .then((result) => {
                if (result.Success) {
                    this.popupService.SimpleMessage('Categoria de descuento', 'La categoria fue agregada.', PopupType.SUCCESS);
                    this.close();
                } else {
                    this.popupService.SimpleMessage('Categoria de descuento', `Error agregando la categoria. ${result.PossibleError}`, PopupType.ERROR);
                    this.close();
                }
            })
            .catch((error) => {
                this.popupService.SimpleMessage('Categoria de descuento', `Error agregando categoria. ${error}`, PopupType.ERROR);
            })
    }

    ngOnInit(): void {

    }
    cerrar() {
        this.close();
    }
}
