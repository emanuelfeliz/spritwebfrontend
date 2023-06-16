import { Component, OnInit } from "@angular/core";
import { WarehouseProduct } from "app/components/products/warehouse-product";
import { DiscountProductClientService } from "app/services/discount-product-client.service";
import {
  PopupProviderService,
  PopupType,
} from "app/services/popupProvider.service";
import { DiscountClient } from "../discount_client/discount-client";
import { DiscountProductClient } from "./discount-product-client";

@Component({
  selector: "app-discount-product-client",
  templateUrl: "./discount-product-client.component.html",
  styleUrls: ["./discount-product-client.component.css"],
})
export class DiscountProductClientComponent implements OnInit {
  discountProductClients: DiscountProductClient[] = [];
  products: WarehouseProduct[] = [];
  discountClients: DiscountClient[] = [];
  discountProductClient: DiscountProductClient = new DiscountProductClient();
  search: string = "";
  tituloModal: string = "";
  page: number = 1;
  limit: number = 5;
  total: number = 0;
  loading: boolean = false;
  constructor(
    private service: DiscountProductClientService,
    private popupProviderService: PopupProviderService
  ) {}

  getDiscountProductClients(page: number = 0) {
    this.loading = true;
    this.page = page !== 0 ? page : this.page;

    this.service
      .getDiscountProductClients(this.search)
      .then((result) => {
        if (result.PossibleError === "") {
          this.discountProductClients = result.List;
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

  confirmDelete(discountProductClient: DiscountProductClient) {
    // this.client = client;
    this.popupProviderService.QuestionMessage(
      "Eliminar Descuento",
      "Estás seguro de eliminar el descuento " +
        discountProductClient.DiscountName +
        "?",
      PopupType.WARNING,
      "SI!",
      "NO!",
      () => {
        this.deleteDiscountProductClient(discountProductClient);
      },
      () => {}
    );
  }
  deleteDiscountProductClient(discountProductClient: DiscountProductClient) {
    this.loading = true;
    this.service
      .deleteDiscountProductClient(discountProductClient)
      .then((reponse) => {
        if (reponse.Success) {
          this.popupProviderService.SimpleMessage(
            "Éxito",
            "Descuento eliminado",
            PopupType.SUCCESS
          );
          this.loading = false;
          this.getDiscountProductClients();
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

  editDiscountProductClient(discountProductClient: DiscountProductClient) {
    this.discountProductClient = discountProductClient;
    this.tituloModal = "Editar";
  }

  newDiscountProductClient() {
    this.tituloModal = "Nuevo";
    this.discountProductClient = new DiscountProductClient();
    this.discountProductClient.ClientId = null;
    this.discountProductClient.ClientName = null;
    this.discountProductClient.DiscountAmount = 0;
    this.discountProductClient.DiscountName = null;
    this.discountProductClient.Id = 0;
    this.discountProductClient.MinimumComsuption = 0;
    this.discountProductClient.ProductId = null;
    this.discountProductClient.ProductName = null;
  }

  saveDiscountProductClient() {

    if ( this.validate()) {
    this.loading = true;
    this.service
      .saveDiscountProductClients(this.discountProductClient)
      .then((reponse) => {
        if (reponse.Success) {
          this.popupProviderService.SimpleMessage(
            "Éxito",
            "Descuento registrado",
            PopupType.SUCCESS
          );
          this.loading = false;
          this.getDiscountProductClients();
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

  getAllProducts() {
    this.service
      .getAllProductsDiscount()
      .then((reponse) => {
        this.products = reponse.List;
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

  if (this.discountProductClient.ClientId == null ||  this.discountProductClient.ClientId == undefined || this.discountProductClient.ClientId == 0) {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe seleccionar un cliente!',
      PopupType.WARNING
    );
    return false;
  }
  if (this.discountProductClient.ProductId == null ||  this.discountProductClient.ProductId == undefined || this.discountProductClient.ProductId == 0) {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe seleccionar un producto!',
      PopupType.WARNING
    );
    return false;
  }
  if (this.discountProductClient.DiscountName == null ||  this.discountProductClient.DiscountName == undefined || this.discountProductClient.DiscountName == "") {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe digitar un nombre para el descuento!',
      PopupType.WARNING
    );
    return false;
  }

  if (this.discountProductClient.MinimumComsuption == null ||  this.discountProductClient.MinimumComsuption == undefined ) {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe digitar el minimo de consumo!',
      PopupType.WARNING
    );
    return false;
  }

  if (this.discountProductClient.DiscountAmount == null ||  this.discountProductClient.DiscountAmount == undefined || this.discountProductClient.DiscountAmount == 0) {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe digitar la cantidad de descuento!',
      PopupType.WARNING
    );
    return false;
  }

  

  return true;

    
 }
  ngOnInit() {
    this.getAllProducts();
    this.getAllDiscountClients();
    this.getDiscountProductClients();
  }
}
