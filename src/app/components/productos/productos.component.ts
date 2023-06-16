import { GenericResponse } from './../../models/GenericResponse.model';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/productos/producto.model';
import { Category } from '../../models/categorias/categoria.model';
import { ProductosService } from '../../services/productos.service';
import { CategoriesService } from '../../services/categories.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {

  public categories: Category[] = [];
  public productos: Producto[] = [];
  public producto: Producto;
  public creando: boolean = false;
  public editando: boolean = false;
  public textoBoton: string;
  public loading: boolean = false;
  constructor(private popupProviderService: PopupProviderService, private router: Router, private productosService: ProductosService,
    private categoriesService: CategoriesService) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.productos == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        // this.producto = new Producto(0, '', '', '', 0, 0, false, 0);
        this.textoBoton = 'Crear producto';
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  loadCategorias = () => {
    this.categoriesService.getCategories()
      .then(
        result => {
          if (result.PossibleError == '') {
            this.categories = result.List;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Productos', error, PopupType.ERROR);
        });
  }
  costChange(){
    if (this.producto.itbis) {
    this.producto.price =  this.producto.cost + (this.producto.cost * 0.18);
    }else {

    this.producto.price =  this.producto.cost;
    }
  }
  //Metodo para validar el objeto
  validateModel = (producto: Producto): boolean => {
    return producto.description != '' && producto.code != '' && producto.price > 0 && producto.cost > 0 && producto.product_categoryid != null && producto.product_categoryid != 0;
  }
  editarProducto = (producto: Producto) => {
    this.creando = false;
    this.editando = true;
    this.textoBoton = 'Cancelar edición';
    this.producto = producto;
  }
  botones = () => {
    if (!this.creando && !this.editando) {
      this.creando = true;
      // this.producto = new Producto(0, '', '', '', 0, 0, false, 0);
      this.textoBoton = 'Cancelar';
    } else if (this.creando) {
      this.creando = false;
      // this.producto = new Producto(0, '', '', '', 0, 0, false, 0);
      this.textoBoton = 'Crear producto';
    } else if (this.editando) {
      this.editando = false;
      // this.producto = new Producto(0, '', '', '', 0, 0, false, 0);
      this.textoBoton = 'Crear producto';
    }
  }
  onSubmit = () => {
    if (this.creando) {
      this.productosService.addProducto(this.producto)
        .then(
          result => {
            if (result.Success) {
              this.popupProviderService.SimpleMessage(
                'Éxito',
                'Producto agregado',
                PopupType.SUCCESS
              );
              this.getProductos();
            } else {
              this.popupProviderService.SimpleMessage(
                'Producto no agregado',
                'Algo salió mal!',
                PopupType.ERROR
              );
            }
            this.creando = false;
            this.textoBoton = 'Crear producto';
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Poductos', error, PopupType.ERROR);
          });
    } else if (this.editando) {
      this.productosService.editProducto(this.producto)
        .then(
          result => {
            if (result.Success) {
              this.popupProviderService.SimpleMessage(
                'Éxito',
                'Producto modificado',
                PopupType.SUCCESS
              );
              this.getProductos();
            } else {
              this.popupProviderService.SimpleMessage(
                'Producto no modificado',
                'Algo salió mal!',
                PopupType.ERROR
              );
            }
            this.editando = false;
            this.textoBoton = 'Crear producto';
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Productos', error, PopupType.ERROR);
          });
    }

  }
  getProductos = () => {
    this.loading = true;
    this.productosService.getProductos()
      .then(
        result => {
          if (result.PossibleError === '') {
            this.productos = result.List;
            this.loading = false;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Productos', error, PopupType.ERROR);
        });
  }
  ngOnInit() {
    this.getProductos();
    this.loadCategorias();
  }
  deleteProducto = (productoid: number) => {
    this.productosService.deleteProducto(productoid).then(response => {
      if (response.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Producto eliminado',
          PopupType.SUCCESS
        );
        this.getProductos();
      } else {
        this.popupProviderService.SimpleMessage(
          'Producto no eliminado',
          'Algo salió mal!',
          PopupType.ERROR
        );
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Productos', error, PopupType.ERROR);
    });
  }
  confirmarBorrarProducto = (producto: Producto) => {
    this.popupProviderService.QuestionMessage('Eliminar producto', `Estás seguro de eliminar el producto ${producto.description}?`,
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.deleteProducto(producto.id);
      }, () => {
      });
  }
}
