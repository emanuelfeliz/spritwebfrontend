import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { CreditUser } from 'app/models/credit_user/credit_user.model';
import { CreditUserService } from 'app/services/credit_user.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { Subscription, Observable, of, combineLatest } from 'rxjs';
import { DialogService } from 'ng6-bootstrap-modal';
import { NewCreditUserModalComponent } from './modals/add_new_credit_user_modal.component';
import { EditCreditUserModalComponent } from './modals/edit/edit_credit_user_modal.component';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-credit-user',
  templateUrl: './credit_user.component.html'
})

export class CreditUserComponent implements OnInit {

  NEW_USER_CREDIT_MODAL: Subscription;
  EDIT_USER_CREDIT_MODAL: Subscription;
  credits_users: CreditUser[] = [];
  rncFilter: FormControl;
  rncFilter$: Observable<string>;
  creditUsers$: Observable<CreditUser[]>;
  filteredCreditUsers$: Observable<CreditUser[]>;
  // page: number = 0;

  page: FormControl;
  page$: Observable<number>;

  totalPages: number = 0;

  constructor(private dialogService: DialogService, private creditUserService: CreditUserService, private popupProviderService: PopupProviderService) {
  }

  async ngOnInit() {
    this.rncFilter = new FormControl('');
    this.rncFilter$ = this.rncFilter.valueChanges.pipe(startWith(''));
    this.rncFilter.valueChanges.subscribe({
      next: x => this.getCreditUsers(this.page.value, x).then(x => this.credits_users = x),
      error: err => console.error('Observer got an error: ' + err),
    });

    this.page = new FormControl(0);
    this.page$ = this.page.valueChanges.pipe(startWith(0));
    this.page.valueChanges.subscribe({
      next: x => {
        console.log(x)
        return this.getCreditUsers(x, this.rncFilter.value).then(x => this.credits_users = x)
      },
      error: err => console.error('Observer got an error: ' + err),
    });

    this.creditUsers$ = of(await this.getCreditUsers());
    this.filteredCreditUsers$ = combineLatest(this.creditUsers$, this.rncFilter$).pipe(map(([credits_users, filterString]) => {
      return credits_users.filter(credit_user => credit_user.RNC.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
    }));
  }

  async changePage(page: number = 0) {
    this.creditUsers$ = of(await this.getCreditUsers(page, this.rncFilter.value));
    this.filteredCreditUsers$ = combineLatest(this.creditUsers$, this.rncFilter$, this.page$).pipe(map(([credits_users, filterString, page]) => {
      return credits_users.filter(credit_user => credit_user.RNC.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
    }));
    this.page.setValue(page || 0);
  }

  async getCreditUsers(page: number = 0, rnc: string = ""): Promise<CreditUser[]> {
    try {
      page = page != 0 ? page : this.page.value;
      const result = await this.creditUserService.getCreditUsers(10, page, rnc || '');

      if (result.PossibleError === '') {
        this.totalPages = result.TotalRecords;
        return result.List;
      } else {
        this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: ${result.PossibleError}`, PopupType.ERROR);
      }
    } catch (error) {
      this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: error de parte del servidor`, PopupType.ERROR);
    }
  }

  deleteCreditUser(id: number) {
    this.creditUserService.deleteCreditUser(id)
      .then((result) => {
        if (result.Success) {
          this.popupProviderService.SimpleMessage('Usuario de creditos', `El usuario ha sido eliminado`, PopupType.SUCCESS);
          this.getCreditUsers();
        } else {
          this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: ${result.PossibleError}`, PopupType.ERROR);
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage('Usuario de creditos', `Error: error de parte del servidor`, PopupType.ERROR);
      });
  }

  openModalNewUserCredit(): void {
    this.NEW_USER_CREDIT_MODAL = this.dialogService.addDialog(NewCreditUserModalComponent,null).subscribe(
      result => {
        this.getCreditUsers();
        if (result == 'close') {
          this.NEW_USER_CREDIT_MODAL.unsubscribe();
        }
      }
    );
  }

  openModalEditUserCredit(creditUser: CreditUser): void {
    this.EDIT_USER_CREDIT_MODAL = this.dialogService.addDialog(EditCreditUserModalComponent,
      { creditUserId: creditUser.Id }).subscribe(
        result => {
          this.getCreditUsers();

          if (result == 'close') {
            this.EDIT_USER_CREDIT_MODAL.unsubscribe();
          }
        }
      );
  }
}
