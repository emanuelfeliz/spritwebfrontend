import { Component, OnInit } from "@angular/core";
import { DiscountProductClientService } from "app/services/discount-product-client.service";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { DiscountClient } from "./discount-client";

@Component({
  selector: "app-discount-client",
  templateUrl: "./discount-client.component.html",
  styleUrls: ["./discount-client.component.css"],
})
export class DiscountClientComponent implements OnInit {
  clients: DiscountClient[] = [];
  client: DiscountClient = new DiscountClient();
  search: string = "";
  tituloModal:string = "";
  page: number = 1;
  limit: number = 5;
  total: number = 0;
  loading: boolean = false;
  constructor(
    private service: DiscountProductClientService,
    private popupProviderService: PopupProviderService
  ) {}

  getClients(page: number = 0) {
    this.loading = true;
    this.page = page !== 0 ? page : this.page;
    
    this.service
      .getDiscountClients(this.page, this.limit, this.search)
      .then((result) => {
        if (result.PossibleError === "") {
          this.clients = result.List;
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


  confirmDelete(client: DiscountClient) {
    // this.client = client;
    this.popupProviderService.QuestionMessage('Eliminar cliente', 'Estás seguro de eliminar al cliente '+client.Name +'?',
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.deleteClient(client);
      }, () => {
      });
  };
  deleteClient(client: DiscountClient) {
    this.loading = true;
    this.service.deleteDiscountClient(client)
    .then(reponse => {
      if (reponse.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Cliente eliminado',
          PopupType.SUCCESS
        );
        this.loading = false;
        this.getClients();
      } else {
        this.popupProviderService.SimpleMessage(
          'Cliente no fue eliminado',
          'Cuidado: ' + reponse.PossibleError,
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

  editClient(client: DiscountClient) {
    this.client = client;
    this.tituloModal = "Editar";

  }

  newClient() {
    this.tituloModal = "Nuevo";
  this.client = new DiscountClient();
  this.client.DocumentNumber = null;
  this.client.DocumentType = null;
  this.client.Id = 0;
  this.client.Name = null;
    
  }

  saveClient() {
    this.loading = true;
    this.service.saveDiscountClients(this.client)
    .then(reponse => {
      if (reponse.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Cliente registrado',
          PopupType.SUCCESS
        );
        this.loading = false;
        this.getClients();
      } else {
        this.popupProviderService.SimpleMessage(
          'Cliente no fue registrado',
          'Cuidado: ' + reponse.PossibleError,
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

  ngOnInit() {
    this.getClients();
  }
}
