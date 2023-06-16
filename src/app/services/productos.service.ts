import { Injectable } from "@angular/core";
import { InvocationService } from "app/services/invocationService.service";
import { ModelList } from "app/models/ModelList.model";
import { GenericResponse } from "app/models/GenericResponse.model";
import { WarehouseProduct, WarehouseProductCategory } from "app/components/products/warehouse-product";
import { Product } from "app/models/multiple_bills/product.model";
import { Producto } from "app/models/productos/producto.model";
import { environment } from 'environments/environment';


@Injectable()
export class ProductosService {
  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }

  getProducts = (
    pagina: number,
    limite: number,
    search: string
  ): Promise<ModelList<WarehouseProduct>> => {
    const route = `api/Productos/getProducts?page=${pagina}&limit=${limite}&search=${search}`;
    return this.invocationService.invokeBackendService<
      ModelList<WarehouseProduct>,
      null
    >(this.invocationService.GET, this.url + route);
  };

  saveProducts = (
    product: WarehouseProduct
  ): Promise<GenericResponse<WarehouseProduct>> => {
    const route = `api/Productos/saveProducts`;
    return this.invocationService.invokeBackendService<
      GenericResponse<WarehouseProduct>,
      WarehouseProduct
    >(this.invocationService.POST, this.url + route, product);
  };

  deleteProduct = (
    product: WarehouseProduct
  ): Promise<GenericResponse<WarehouseProduct>> => {
    const route = `api/Productos/deleteProduct`;
    return this.invocationService.invokeBackendService<
      GenericResponse<WarehouseProduct>,
      WarehouseProduct
    >(this.invocationService.POST, this.url + route, product);
  };
  getAllProductCategory = (): Promise<ModelList<WarehouseProductCategory>> => {
    const route = `api/productos/getAllProductCategory`;
    return this.invocationService.invokeBackendService<ModelList<WarehouseProductCategory>, null>(this.invocationService.GET, this.url + route);
  }
  getProductsSearch = (search:string): Promise<ModelList<Producto>> => {
    let route: string = `api/Productos/search?search=${search}`;
    return this.invocationService.invokeBackendService<
      ModelList<Producto>,
      null
    >(this.invocationService.GET, this.url + route);
  };
  //#region  viejo
  getProductos = (): Promise<ModelList<Producto>> => {
    let route: string = `api/Productos/getProductos`;
    return this.invocationService.invokeBackendService<
      ModelList<Producto>,
      null
    >(this.invocationService.GET, this.url + route);
  };

  addProducto = (producto: Producto): Promise<GenericResponse<Producto>> => {
    let route: string = `api/Productos/saveProducto?description=${producto.description}&code=${producto.code}&id_category=${producto.product_categoryid}&price=${producto.price}&cost=${producto.cost}&itbis=${producto.itbis}`;
    return this.invocationService.invokeBackendService<
      GenericResponse<Producto>,
      null
    >(this.invocationService.GET, this.url + route);
  };
  editProducto = (producto: Producto): Promise<GenericResponse<Producto>> => {
    let route: string = `api/Productos/editProducto?description=${producto.description}&code=${producto.code}&id_category=${producto.product_categoryid}&price=${producto.price}&cost=${producto.cost}&id=${producto.id}&itbis=${producto.itbis}`;
    return this.invocationService.invokeBackendService<
      GenericResponse<Producto>,
      null
    >(this.invocationService.GET, this.url + route);
  };
  deleteProducto = (id: number): Promise<GenericResponse<Producto>> => {
    let route: string = `api/Productos/deleteProducto?idproducto=${id}`;
    return this.invocationService.invokeBackendService<
      GenericResponse<Producto>,
      null
    >(this.invocationService.GET, this.url + route);
  };

  //#endregion

  //TanksProduct
  getAllProducts = (): Promise<ModelList<Product>> => {
    let route: string = `api/Productos/getAllProducts`;
    return this.invocationService.invokeBackendService<
      ModelList<Product>,
      null
    >(this.invocationService.GET, this.url + route);
  };

  //TanksProduct
  getTanksProducts = (): Promise<ModelList<Product>> => {
    let route: string = `api/Productos/GetTanksProducts`;
    return this.invocationService.invokeBackendService<
      ModelList<Product>,
      null
    >(this.invocationService.GET, this.url + route);
  };

  getProductsFromWarehouse = (): Promise<ModelList<Product>> => {
    let route: string = `api/Productos/getProductsFromWarehouse`;
    return this.invocationService.invokeBackendService<
      ModelList<Product>,
      null
    >(this.invocationService.GET, this.url + route);
  };
}
