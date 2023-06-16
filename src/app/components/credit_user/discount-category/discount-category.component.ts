import { Component, OnInit } from '@angular/core';
import { DiscountByCategory } from 'app/models/credit_user/discountByCategory.model';
import { CreditUserService } from 'app/services/credit_user.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'ng6-bootstrap-modal';
import { AddDiscountByCategoryModalComponent } from './modals/add_discount_by_category_modal.component';
import { EditDiscountByCategoryModalComponent } from './modals/edit/edit_discount_by_category_modal.component';

@Component({
  selector: 'app-discount-category',
  templateUrl: './discount-category.component.html',
  styleUrls: ['./discount-category.component.css']
})
export class DiscountCategoryComponent implements OnInit {
  constructor(private dialogService: DialogService, private CreditUserService: CreditUserService, private popupProviderService: PopupProviderService) { }

  NEW_USER_CREDIT_MODAL: Subscription;
  EDIT_USER_CREDIT_MODAL: Subscription;
  DiscountByCategories: DiscountByCategory[] = [];

  ngOnInit(): void {
      this.getDiscountByCategories();
  }

  getDiscountByCategories(): void {
      this.CreditUserService.getDiscountByCategorys(0, 0)
          .then((result) => {
              if (result.PossibleError === '') {
                  this.DiscountByCategories = result.List;
                  console.log(result.List);
              } else {
                  this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: ${result.PossibleError}`, PopupType.ERROR);
              }
          })
          .catch((error) => {
            console.log(error);
              this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: error de parte del servidor`, PopupType.ERROR);
          });
  }

  deleteDiscountByCategories(id: number) {
      this.CreditUserService.deleteDiscountByCategory(id)
      .then((result) => {
              if (result.Success) {
                  this.popupProviderService.SimpleMessage('Usuario de creditos', `El usuario ha sido eliminado`, PopupType.SUCCESS);
                  this.getDiscountByCategories();
              } else {
                  this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: ${result.PossibleError}`, PopupType.ERROR);
              }
          })
          .catch((error) => {
              this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: error de parte del servidor`, PopupType.ERROR);
          });
  }

  openModalNewDiscountByCategory(): void {
      this.NEW_USER_CREDIT_MODAL = this.dialogService.addDialog(AddDiscountByCategoryModalComponent, '').subscribe(
          result => {
              this.getDiscountByCategories();

              if (result == 'close') {
                  this.NEW_USER_CREDIT_MODAL.unsubscribe();
              }
          }
      );
  }

  openModalEditDiscountByCategory(DiscountByCategory: DiscountByCategory): void {
      this.EDIT_USER_CREDIT_MODAL = this.dialogService.addDialog(EditDiscountByCategoryModalComponent,
          {discountByCategoryId: DiscountByCategory.id}).subscribe(
          result => {
              this.getDiscountByCategories();

              if (result == 'close') {
                  this.EDIT_USER_CREDIT_MODAL.unsubscribe();
              }
          }
      );
  }

}
