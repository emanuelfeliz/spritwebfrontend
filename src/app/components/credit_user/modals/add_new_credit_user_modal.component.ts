import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Component, OnInit } from "@angular/core";
import { CreditUser } from "app/models/credit_user/credit_user.model";
import { CreditUserService } from "app/services/credit_user.service";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { DiscountByCategory } from "app/models/credit_user/discountByCategory.model";

@Component({
    selector: 'modal_new_credit_user-app',
    templateUrl: './add_new_credit_user_modal.component.html'
})

export class NewCreditUserModalComponent extends DialogComponent<string, string> implements OnInit {

  DiscountByCategories: DiscountByCategory[] = [];
  discountCategorySelected: string=' / ';

  new_credit_user: CreditUser = {
        BarCode: '',
        CountryIdCode: '',
        Id: 0,
        QrCode: '',
        RNC: '',
        CompanyName:'',
        discountCategory: 0,
        discountAmount: 0,
        categoryname: '',
        customerType: '0'
    };

    categoriesDiscount: DiscountByCategory[] = [];

    constructor(dialogService: DialogService, private credit_user_service: CreditUserService, private popupService: PopupProviderService) {
        super(dialogService);
    }

    validate(): boolean {
        if (this.new_credit_user.RNC === '' || this.new_credit_user.RNC === null) {
           this.popupService.SimpleMessage('Validacion', `Debe llenar todos los campos.`, PopupType.ERROR);
            return true;
        }

        if(this.discountCategorySelected === '' || this.discountCategorySelected === ' / ' || this.discountCategorySelected ===null || this.discountCategorySelected ==='0'){
          this.popupService.SimpleMessage('Validacion', `Debe elegir una categoria de descuento. *Si no existe, debe crearla`, PopupType.ERROR);
          return true;
        }

        if(this.new_credit_user.customerType ==='0' || this.new_credit_user.customerType ===''){
          this.popupService.SimpleMessage('Validacion', `Debe elegir un tipo de clientre`, PopupType.ERROR);
          return true;
        }
        return false;
    }

    setCategory() {
      this.categoriesDiscount = this.DiscountByCategories.filter(x => x.categoryType === this.new_credit_user.customerType );
    }

    addNewCreditUser(): void {

      if(this.validate())
      return;
        this.credit_user_service.addNewCreditUser(this.new_credit_user)
            .then((result) => {
                if (result.Success) {
                    this.popupService.SimpleMessage('Usuario de credito', 'El usuario a sido agregado.', PopupType.SUCCESS);
                    this.close();
                } else {
                    this.popupService.SimpleMessage('Usuario de credito', `El error agregando el usuario. ${result.PossibleError}`, PopupType.ERROR);
                    this.close();
                }
            })
            .catch((error) => {
                this.popupService.SimpleMessage('Usuario de credito', `El error agregando el usuario. ${error}`, PopupType.ERROR);
            })
    }

    ngOnInit(): void {
      this.getDiscountByCategories();
      this.new_credit_user.customerType = 'Seleccione un tipo de cliente';
    }
    cerrar() {
        this.close();
    }

    getDiscountByCategories(): void {
      this.credit_user_service.getDiscountByCategorys(0, 0)
          .then((result) => {
              if (result.PossibleError === '') {
                  this.DiscountByCategories = result.List;
              } else {
                  this.popupService.SimpleMessage('Usuario de creditos', `Error: ${result.PossibleError}`, PopupType.ERROR);
              }
          })
          .catch((error) => {
            console.log(error);
              this.popupService.SimpleMessage('Usuario de creditos', `Error: error de parte del servidor`, PopupType.ERROR);
          });
  }

  assingCategory(): void {
    this.new_credit_user.discountAmount = parseFloat(this.discountCategorySelected.split('/')[1]);
    this.new_credit_user.discountCategory = parseInt(this.discountCategorySelected.split('/')[0]);
  }
}
