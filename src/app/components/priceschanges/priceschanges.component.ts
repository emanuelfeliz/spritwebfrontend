import { Component, OnInit } from '@angular/core';
import { PriceChange } from '../../models/priceschanges/PriceChange.model';
import { PriceschangeserviceService } from '../../services/priceschangeservice.service';
import { PopupProviderService, PopupType } from '../../services/popupProvider.service';
import { GenericResponse } from '../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { PriceChangeDetail } from '../../models/priceschanges/PriceChangeDetail.model';
import { PriceChangeModel } from '../../models/priceschanges/PriceChangeModel.model';
import { HelperServiceService } from '../../services/helper-service.service';

@Component({
  selector: 'app-priceschanges',
  templateUrl: './priceschanges.component.html'
})
export class PriceschangesComponent implements OnInit {

  fechaAplicacion = '';
  priceschanges: Array<PriceChange> = [];
  total: number;
  p = 1;
  es: any;
  esLocale = require('date-fns/locale/es');
  loading = false;
  detallesCambioPrecio: Array<PriceChangeDetail> = [];
  detallesPrecioActuales: Array<PriceChangeDetail> = [];
  
  levelSelected = 1;
  constructor(private popupProviderService: PopupProviderService,
    private HelperServiceService:HelperServiceService,
    private priceChangeService: PriceschangeserviceService, private router: Router) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));

    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response.prices_changes === false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
        this.getPricesChanges();
        this.getCurrentsPricesChangesDetails();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  renderResume = (): string => {
    let result = '';
    this.detallesPrecioActuales.forEach(x => {
      result +=
        `<tr>
        <td class='text-center'>${x.product}</td>
        <td class='text-center'>${x.ppu}</td>
        <td class='text-center'>${x.price_level}</td>
      </tr>`;
    });
    return result;
  }
  savePriceChange() {
    if (this.fechaAplicacion === '') {
      this.popupProviderService.SimpleMessage('Validacion',
        'Debe seleccionar la fecha de aplicacion', PopupType.WARNING);
      return;
    }
    this.popupProviderService.QuestionMessageHtml('<i>ATENCION</i> <u>Revisar Precios</u>',
      PopupType.QUESTION, 'Si', 'No',
      `<span>Fecha-aplicacion: ${this.fechaAplicacion}</span>
      <table class='table table-striped table-hover'>
        <thead>
          <tr>
            <th class='text-center'>Producto</th>
            <th class='text-center'>Precio</th>
            <th class='text-center'>Nivel</th>
          </tr>
        </thead>
        <tbody>
          ${this.renderResume()}
        </tbody>
      </table>`, () => {
        this.detallesPrecioActuales.forEach(x => x.price_change_id = 0);
        this.detallesPrecioActuales.forEach(x => x.price_level = this.levelSelected);
        const priceChange: PriceChangeModel = new PriceChangeModel(new PriceChange(0, this.fechaAplicacion.split(' ')[0],
          this.fechaAplicacion.split(' ')[1], '', '', []),
          this.detallesPrecioActuales);

        this.priceChangeService.SavePriceChange(priceChange)
          .then(data => {
            if (data.Success) {
              this.popupProviderService.SimpleMessage('Exito', 'Precios cambiados', PopupType.SUCCESS);
            } else {
              this.popupProviderService.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
            }
            this.getPricesChanges(1);
          })
          .catch(error => this.popupProviderService.SimpleMessage('Error cambiando precios', error, PopupType.ERROR));
      }, () => {
        this.popupProviderService.SimpleMessage('Operación cancelada',
          'Cambios de precios cancelados', PopupType.WARNING);
      }
      , () => {
        // this.getCurrentsPricesChangesDetails();
        // this.getPricesChanges();
        // this.fechaAplicacion = '';
      });
  }
  getCurrentsPricesChangesDetails() {
    this.priceChangeService.getCurrentsPricesChangesDetails(this.levelSelected)
      .then(result => this.detallesPrecioActuales = result)
      .catch(error => this.popupProviderService.SimpleMessage('Error obteniendo precios actuales', error, PopupType.ERROR));
  }
  getPricesChanges(page: number = 0) {
    this.p = page !== 0 ? page : this.p;
    this.loading = true;
    this.priceChangeService.getPricesChanges(10, this.p)
      .then(result => {
        this.loading = false;
        if (result.PossibleError === '') {
          this.priceschanges = result.List;
          this.total = result.TotalRecords;
        } else {
          this.popupProviderService.SimpleMessage('Error consultando histórico de precios',
            result.PossibleError, PopupType.ERROR);
        }
      })
      .catch(error => {
        this.loading = false;
        this.popupProviderService.SimpleMessage('Error interno consultando histórico de precios',
          error, PopupType.ERROR);
      });
  }
  ngOnInit() {
  }

}
