import { Component, OnInit } from "@angular/core";
import { DiscountProductClientService } from "app/services/discount-product-client.service";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { DiscountClient } from "../discount_client/discount-client";
import { DiscountTktPlu } from "./discount-tkt-plu";
import { TktPluSelect } from "./tkt-plu";

@Component({
  selector: "app-discount-tkt-plu",
  templateUrl: "./discount-tkt-plu.component.html",
  styleUrls: ["./discount-tkt-plu.component.css"],
})
export class DiscountTktPluComponent implements OnInit {
  search: string = "";
  discountTktPluList: DiscountTktPlu[] = [];
  TktPluSelects: TktPluSelect[] = [];
  discountClients: DiscountClient[] = [];
  discountTktPlu: DiscountTktPlu = new DiscountTktPlu();
  tituloModal: string = "";
  page: number = 1;
  limit: number = 5;
  total: number = 0;
  loading: boolean = false;
  constructor(
    private service: DiscountProductClientService,
    private popupProviderService: PopupProviderService
  ) {}

  getDiscountTktPlu(page: number = 0) {
    this.loading = true;
    this.page = page !== 0 ? page : this.page;
    this.service
    .getDiscountTktPlus(this.search)
    .then((result) => {
      if (result.PossibleError === "") {
        this.discountTktPluList = result.List;
        this.total = result.TotalRecords;
      }
      this.loading = false;
    })
    .catch((error) => {
      this.popupProviderService.SimpleMessage(
        "Descuentos",
        error,
        PopupType.ERROR
      );
      this.loading = false;
    });
  }
  saveDiscountTktPlu() {
    if ( this.validate()) {
      this.loading = true;
      this.service
        .saveDiscountTktPlu(this.discountTktPlu)
        .then((reponse) => {
          if (reponse.Success) {
            this.popupProviderService.SimpleMessage(
              "Éxito",
              "Descuento registrado",
              PopupType.SUCCESS
            );
            this.loading = false;
            this.getDiscountTktPlu();
          } else {
            this.popupProviderService.SimpleMessage(
              "Descuento no fue registrado",
              "Cuidado: " + reponse.PossibleError,
              PopupType.WARNING
            );
          }
        })
        .catch((error) => {
          this.popupProviderService.SimpleMessage(
            "Descuentos",
            error,
            PopupType.ERROR
          );
          this.loading = false;
        });
      }
  }
  confirmDelete(discount: DiscountTktPlu) {
    this.popupProviderService.QuestionMessage(
      "Eliminar Descuento",
      "Estás seguro de eliminar el descuento " +
      discount.DiscountName +
        "?",
      PopupType.WARNING,
      "SI!",
      "NO!",
      () => {
        this.deleteDiscountTktPlu(discount);
      },
      () => {}
    );
  }
  deleteDiscountTktPlu(discount: DiscountTktPlu) {
    this.loading = true;
    this.service
      .deleteDiscountTktPlu(discount)
      .then((reponse) => {
        if (reponse.Success) {
          this.popupProviderService.SimpleMessage(
            "Éxito",
            "Descuento eliminado",
            PopupType.SUCCESS
          );
          this.loading = false;
          this.getDiscountTktPlu();
        } else {
          this.popupProviderService.SimpleMessage(
            "Descuento no fue eliminado",
            "Cuidado: " + reponse.PossibleError,
            PopupType.WARNING
          );
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Descuentos",
          error,
          PopupType.ERROR
        );
        this.loading = false;
      });


  }

  newDiscountTktPlu() {
    this.tituloModal = "Nuevo";
    this.discountTktPlu = new DiscountTktPlu();
    this.discountTktPlu.ClientId = null;
    this.discountTktPlu.Client = null;
    this.discountTktPlu.DiscountAmount = 0;
    this.discountTktPlu.DiscountName = null;
    this.discountTktPlu.Id = 0;
    this.discountTktPlu.MinimumConsumption = 0;
    this.discountTktPlu.TktPluId = null;
    this.discountTktPlu.Product = null;
  }
  editDiscountTktPlu(discount: DiscountTktPlu) {
    this.discountTktPlu = discount;
    this.tituloModal = "Editar";
  }

  getAllTktPlu() {
    this.service
      .getAllTktPlu()
      .then((reponse) => {
        this.TktPluSelects = reponse.List;
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Descuentos",
          error,
          PopupType.ERROR
        );
        this.loading = false;
      });
  }

  getAllDiscountClients() {
    this.service
      .getAllDiscountClients()
      .then((reponse) => {
        this.discountClients = reponse.List;
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Descuentos",
          error,
          PopupType.ERROR
        );
        this.loading = false;
      });
  }

  validate():boolean{
    if (this.discountTktPlu.DiscountName == null ||  this.discountTktPlu.DiscountName == undefined || this.discountTktPlu.DiscountName == "") {
      this.popupProviderService.SimpleMessage(
        'Advertencia',
        'Debe digitar un nombre para el descuento!',
        PopupType.WARNING
      );
      return false;
    }
    if (this.discountTktPlu.TktPluId == null ||  this.discountTktPlu.TktPluId == undefined || this.discountTktPlu.TktPluId == 0) {
      this.popupProviderService.SimpleMessage(
        'Advertencia',
        'Debe seleccionar un combustible!',
        PopupType.WARNING
      );
      return false;
    }
    if (this.discountTktPlu.ClientId == null ||  this.discountTktPlu.ClientId == undefined || this.discountTktPlu.ClientId == 0) {
      this.popupProviderService.SimpleMessage(
        'Advertencia',
        'Debe seleccionar un cliente!',
        PopupType.WARNING
      );
      return false;
    }
    
    
  
    if (this.discountTktPlu.MinimumConsumption == null ||  this.discountTktPlu.MinimumConsumption == undefined ) {
      this.popupProviderService.SimpleMessage(
        'Advertencia',
        'Debe digitar el minimo de consumo galones!',
        PopupType.WARNING
      );
      return false;
    }
  
    if (this.discountTktPlu.DiscountAmount == null ||  this.discountTktPlu.DiscountAmount == undefined || this.discountTktPlu.DiscountAmount == 0) {
      this.popupProviderService.SimpleMessage(
        'Advertencia',
        'Debe digitar la cantidad de descuento por galon!',
        PopupType.WARNING
      );
      return false;
    }
 
   return true;
 
     
  }
  ngOnInit() {
    this.getAllTktPlu();
    this.getAllDiscountClients();
    this.getDiscountTktPlu();
  }
}
