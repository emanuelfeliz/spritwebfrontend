import { Component, OnInit } from "@angular/core";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { ProductosService } from "app/services/productos.service";
import { WarehouseProduct, WarehouseProductCategory } from "./warehouse-product";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
  products: WarehouseProduct[] = [];
  productCategories: WarehouseProductCategory[] = [];
  product: WarehouseProduct = new WarehouseProduct();
  search: string = "";
  tituloModal: string = "";
  page: number = 1;
  limit: number = 5;
  total: number = 0;
  loading: boolean = false;
  constructor(
    private service: ProductosService,
    private popupProviderService: PopupProviderService
  ) {}

  getProducts(page: number = 0) {
    this.loading = true;
    this.page = page !== 0 ? page : this.page;
    this.service
    .getProducts(this.page, this.limit, this.search)
    .then((result) => {
      if (result.PossibleError === "") {
        this.products = result.List;
        this.total = result.TotalRecords;
      }
      this.loading = false;
    })
    .catch((error) => {
      this.popupProviderService.SimpleMessage(
        "Almacen",
        error,
        PopupType.ERROR
      );
      this.loading = false;
    });
}

 calculatePrice(){
   this.product.price = this.product.price / 1.18;
   this.product.price = parseFloat(this.product.price.toFixed(2));
 }

 validate():boolean{

  if (this.product.description == null ||  this.product.description == undefined || this.product.description == "") {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe digitar una descripcion!',
      PopupType.WARNING
    );
    return false;
  }
  if (this.product.product_categoryid == null ||  this.product.product_categoryid == undefined || this.product.product_categoryid == 0) {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe seleccionar la categoria!',
      PopupType.WARNING
    );
    return false;
  }
  if (this.product.code == null ||  this.product.code == undefined || this.product.code == "") {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe digitar un codigo!',
      PopupType.WARNING
    );
    return false;
  }

  if (this.product.cost == null ||  this.product.cost == undefined || this.product.cost == 0) {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe digitar el costo!',
      PopupType.WARNING
    );
    return false;
  }

  if (this.product.price == null ||  this.product.price == undefined || this.product.price == 0) {
    this.popupProviderService.SimpleMessage(
      'Advertencia',
      'Debe digitar el precio!',
      PopupType.WARNING
    );
    return false;
  }

  

  return true;

    
 }
confirmDelete(product: WarehouseProduct) {
  // this.client = client;
  this.popupProviderService.QuestionMessage('Eliminar producto', 'Estás seguro de eliminar el producto '+product.description +'?',
    PopupType.WARNING, 'SI!', 'NO!',
    () => {
      this.deleteProduct(product);
    }, () => {
    });
};
deleteProduct(product: WarehouseProduct) {
  this.loading = true;
  this.service.deleteProduct(product)
  .then(reponse => {
    if (reponse.Success) {
      this.popupProviderService.SimpleMessage(
        'Éxito',
        'Producto eliminado',
        PopupType.SUCCESS
      );
      this.loading = false;
      this.getProducts();
    } else {
      this.popupProviderService.SimpleMessage(
        'Producto no fue eliminado',
        'Cuidado: ' + reponse.PossibleError,
        PopupType.WARNING
      );
    }
  })
  .catch((error) => {
    this.popupProviderService.SimpleMessage(
      "Almacen",
      error,
      PopupType.ERROR
    );
    this.loading = false;
  });
}

editProduct(product: WarehouseProduct) {
  this.product = product;
  this.tituloModal = "Editar";
  this.product.price = parseFloat(this.product.price.toFixed(2));
  this.product.cost = parseFloat(this.product.cost.toFixed(2));
}

newProduct() {
  this.tituloModal = "Nuevo";
this.product = new WarehouseProduct();
this.product.categoria = null;
this.product.code = null;
this.product.cost = 0;
this.product.description = null;
this.product.id = 0;
this.product.itbis = false;
this.product.price = 0;
this.product.product_categoryid = null;
  
}

saveProduct() {
  this.loading = true;

  if (this.validate()) {
    this.service.saveProducts(this.product)
  .then(reponse => {
    if (reponse.Success) {
      this.popupProviderService.SimpleMessage(
        'Éxito',
        'Producto registrado',
        PopupType.SUCCESS
      );
      this.loading = false;
      this.getProducts();
    } else {
      this.popupProviderService.SimpleMessage(
        'Producto no fue registrado',
        'Cuidado: ' + reponse.PossibleError,
        PopupType.WARNING
      );
    }
  })
  .catch((error) => {
    this.popupProviderService.SimpleMessage(
      "Almacen",
      error,
      PopupType.ERROR
    );
    this.loading = false;
  });
  }

  

  
}
getAllProductCategory() {
  this.service
    .getAllProductCategory()
    .then((reponse) => {
      this.productCategories = reponse.List;
    })
    .catch((error) => {
      this.popupProviderService.SimpleMessage(
        "Productos",
        error,
        PopupType.ERROR
      );
      this.loading = false;
    });
}
  ngOnInit() {
    this.getAllProductCategory();
    this.getProducts();
  }
}
