import { Component, OnInit } from '@angular/core';
import { Entry } from '../../models/ingresos/entry.model';
import { EntryDetail } from '../../models/ingresos/entry_detail.model';
import { EntryService } from '../../services/entry.service';
import { Producto } from '../../models/productos/producto.model';
import { ProductosService } from '../../services/productos.service';
import { GenericResponse } from '../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
declare var alertify;
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styles: []
})
export class EntryComponent implements OnInit {
  public loading: boolean = false;
  public creando: boolean = false;
  public mostrando: boolean = false;
  public products: Array<Producto>;
  public entradas: Array<Entry>;

  public Ingreso: Entry;
  public detallesGenerales: EntryDetail[] = [];

  constructor(private popupProviderService: PopupProviderService, private productsService: ProductosService,
    private entryService: EntryService, private router: Router) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.ingresos == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.InicializarEntry();
        this.getProducts();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }

  }
  verIngreso = (entryEntrante: Entry) => {
    this.mostrando = true;
    this.creando = false;
    this.Ingreso = entryEntrante;
  }

  cancelEntry = (entryEntrante: Entry) => {
    this.entryService.cancelEntry(entryEntrante).then(response => {
      if (response.Success) {
        alertify.success('Ingreso anulado');
        this.getEntries();
      } else {
        alertify.error('Ingreso no anulado');
      }
    }).catch(
      error => {
        this.popupProviderService.SimpleMessage('Entry', error, PopupType.ERROR);
      });
  };
  TotalizarDetails = (): number => {
    let total_: number = 0;
    this.Ingreso.detalles.map((detalle: EntryDetail) => {
      total_ += detalle.cost * detalle.quantity;
    });
    return total_;
  }
  cancelEntryConfirm = (entryEntrante: Entry) => {
    this.popupProviderService.QuestionMessage('Estás seguro de anular el ingreso?', 'Los productos se reducirán del stock',
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.cancelEntry(entryEntrante);
      }, () => { });
  };
  addProductToList = (product: Producto) => {
    if (this.productExistsInList(product)) {
      alertify.message('El producto ya se encuentra en la lista');
      return;
    }
    //SI llego a este punto, quiere decir que el producto no ha sido añadido a la lista entonces lo agrego
    this.Ingreso.detalles.push(
      new EntryDetail(product.description, 1, product.id, product.cost)
    );
    this.Ingreso.total = this.TotalizarDetails();
  };
  onSubmit = () => {
    if (this.creando) {
      this.entryService.addEntry(this.Ingreso)
        .then(
        result => {
          if (result.Success) {
            this.popupProviderService.SimpleMessage(
              'Éxito',
              'Ingreso aprovisionado',
              PopupType.SUCCESS
            );
            this.getEntries();
          } else {
            this.popupProviderService.SimpleMessage(
              'Ingreso no realizado',
              'Algo salió mal!',
              PopupType.ERROR
            );
          }
        }
        ).catch(error => {
          this.popupProviderService.SimpleMessage('Entry', error, PopupType.ERROR);
        });
      this.creando = false;
      this.InicializarEntry();
    }
  };
  removeProduct = (IndexentryDetailToRemove: number) => {
    this.Ingreso.detalles.splice(IndexentryDetailToRemove, 1);
    this.Ingreso.total = this.TotalizarDetails();
  };
  productExistsInList = (producto: Producto): boolean => {
    if (this.Ingreso.detalles) {
      for (var i = 0; i < this.Ingreso.detalles.length; i++) {
        if (this.Ingreso.detalles[i].productid === producto.id) {
          return true;
        }
      }
    }
    return false;
  };
  getProducts = () => {
    this.productsService.getProductos().then(
      result => {
        if (result.PossibleError == '') {
          this.products = result.List;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Entry', error, PopupType.ERROR)
      });
  }
  cancelar = () => {
    this.mostrando = false;
    this.creando = false;
    this.InicializarEntry();
  };
  nuevo = () => {
    this.creando = true;
    this.InicializarEntry();
  }
  InicializarEntry = () => {
    //INICIALIZO el ENTRY
    this.Ingreso = new Entry('', '', '', 0, 'EMITIDO');
    //INICIALIZO SUS ENTRY_DETAILS
    this.Ingreso.detalles = this.detallesGenerales.splice(0, this.detallesGenerales.length);
  };
  validate = (entrada: Entry) => {
    return entrada.description != '' &&
      entrada.total != 0 &&
      (entrada.detalles != null && entrada.detalles.length > 0);
  };
  getEntries = () => {
    this.loading = true;
    this.entryService.getEntries().then(
      result => {
        if (result.PossibleError == '') {
          this.entradas = result.List;
          this.loading = false;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Entry', error, PopupType.ERROR);
      });
  }
  ngOnInit() {
    this.getEntries();
  }

}