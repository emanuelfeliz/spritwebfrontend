import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Component, OnInit } from "@angular/core";
import { CreditUser } from "app/models/credit_user/credit_user.model";
import { CreditUserService } from "app/services/credit_user.service";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { DiscountByCategory } from "app/models/credit_user/discountByCategory.model";

export interface EditCreditUserModel {
  creditUserId: number;
}

@Component({
  selector: 'modal_edit_credit_user-app',
  templateUrl: './edit_credit_user_modal.component.html'
})

export class EditCreditUserModalComponent extends DialogComponent<EditCreditUserModel, null> implements OnInit, EditCreditUserModel {

  creditUserId: number;

  DiscountByCategories: DiscountByCategory[] = [];
  discountCategorySelected: string = ' / ';

  credit_user_to_edit: CreditUser = {
    BarCode: '',
    CountryIdCode: '',
    Id: 0,
    QrCode: '',
    RNC: '',
    CompanyName: '',
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
    if (this.credit_user_to_edit.RNC === '' || this.credit_user_to_edit.RNC === null) {
      this.popupService.SimpleMessage('Validacion', `Debe llenar todos los campos.`, PopupType.ERROR);
      return true;
    }

    if (this.discountCategorySelected === '' || this.discountCategorySelected === ' / ' || this.discountCategorySelected === null || this.discountCategorySelected === '0') {
      this.popupService.SimpleMessage('Validacion', `Debe elegir una categoria de descuento. *Si no existe, debe crearla`, PopupType.ERROR);
      return true;
    }

    if (this.credit_user_to_edit.customerType === '0' || this.credit_user_to_edit.customerType === '') {
      this.popupService.SimpleMessage('Validacion', `Debe elegir un tipo de clientre`, PopupType.ERROR);
      return true;
    }
    return false;
  }

  setCategory() {
    if (this.credit_user_to_edit.customerType === '0') { return; }
    this.categoriesDiscount = this.DiscountByCategories.filter(x => x.categoryType === this.credit_user_to_edit.customerType);
  }
  getCreditUserById(): void {
    this.credit_user_service.getCreditUserById(this.creditUserId)
      .then((result) => {
        if (result.Success) {
          this.credit_user_to_edit = result.Response;
          this.credit_user_to_edit.customerType = '0';
          this.discountCategorySelected = result.Response.discountCategory + '/' + result.Response.discountAmount;
        }
        else {
          this.popupService.SimpleMessage('Usuario de credito', `Error bucando el usuario a editar.
                ${result.PossibleError}`, PopupType.ERROR);
          this.close();
        }

      }).catch((error) => {
        this.popupService.SimpleMessage('Usuario de credito', `Error bucando el usuario a editar. ${error}`, PopupType.ERROR);
      });
  }

  editCreditUser(): void {
    if (this.validate())
      return;

    this.credit_user_service.editCreditUser(this.credit_user_to_edit).then((result) => {
      if (result.Success) {
        this.popupService.SimpleMessage('Usuario de credito', 'El usuario fue actualizado con exito.', PopupType.SUCCESS);
        this.close();

      } else {
        this.popupService.SimpleMessage('Usuario de credito', `El error edito el usuario. ${result.PossibleError}`, PopupType.ERROR);
        this.close();
      }
    })
      .catch((error) => {
        this.popupService.SimpleMessage('Usuario de credito', `El error edito el usuario. ${error}`, PopupType.ERROR);
      });
  }

  ngOnInit(): void {

    this.getCreditUserById();
    this.getDiscountByCategories();

    this.credit_user_to_edit.customerType = '0';
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
    this.credit_user_to_edit.discountAmount = parseFloat(this.discountCategorySelected.split('/')[1]);
    this.credit_user_to_edit.discountCategory = parseInt(this.discountCategorySelected.split('/')[0]);
  }
}
